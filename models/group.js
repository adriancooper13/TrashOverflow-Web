const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GroupMember = require("./groupMember");
const Chore = require("./chore");

const GroupSchema = new Schema({
  group_name: {
    type: String,
    required: true,
  },
  group_members: {
    type: [GroupMember.GroupMemberSchema],
    required: true,
  },
  group_member_count: {
    type: Number,
    default: 1,
  },
  group_description: {
    type: String,
    default: "Our Great Group",
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  group_chores: {
    type: [Chore.ChoreSchema],
  },
});

//A PRE-METHOD that fires before every user.save() call
//Checks to ensure that the group_members were not changed, if they have...
GroupSchema.pre("save", function (next) {
  var group = this;

  // only hash the password if it has been modified (or is new)
  if (group.isModified("group_members") && group.group_members.length === 0) {
    return Group.remove({ _id: this._id }, (err) => {
      if (err) console.log(err);
      next();
    });
  }
  return next();
});

//Add a user to the group_members []
GroupSchema.methods.addGroupMember = function (newMember, doSave, cb) {
  //Format input data
  const data = {
    user_ID: newMember._id,
    user_name: newMember.name,
    completed_tasks: 0,
    point_balance: 0,
  };

  // const added = this.group_members.addToSet(data)
  // if(added.length == 0){
  //   let err = `User: ${data.user_name} is already a member of Group: ${this.group_name}`
  //   return cb(err)
  // }

  const newGroupMember = new GroupMember.model(data);

  //Check for duplicate group
  var unique = true;
  this.group_members.every((member) => {
    if (member.user_ID.equals(newGroupMember.user_ID)) {
      unique = false;
      return false;
    }
    return true;
  });
  //If unique add
  if (unique) {
    this.group_members.push(newGroupMember);
    if (doSave) this.save(cb);
    return;
  } else {
    let err = `User: ${data.user_name} is already a member of Group: ${this.group_name}`;
    return cb(err);
  }
};

//Remove a group member from the group_members []
// RETURNS an error message | '' is no error
GroupSchema.methods.removeGroupMember = function (curMemberID, cb) {
  // remove user from all chores
  for (let i = 0; i < this.group_chores.length; i++) {
    this.group_chores[i].removeUser(curMemberID);
  }
  // remove member
  this.group_members.pull(curMemberID);
  this.save(cb)
    .then((group) => {
      return "";
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

// ***ASSUMES curUser_ID IS THE ID OF AN EXISTING USER***
// Promotes a group member to admin
GroupSchema.methods.promoteGroupMember = function (curUser_ID, doSave, cb) {
  console.log(curUser_ID);
  this.group_members.filter((mem) => curUser_ID == mem.user_ID)[0].admin = true;
  if (doSave) this.save(cb);
  else cb;

  return true;
};

// ***ASSUMES curUser_ID IS THE ID OF AN EXISTING USER who is a GROUP MEMBER***
// Demotes a group member from admin
GroupSchema.methods.demoteGroupMember = function (curUser_ID, cb) {
  this.group_members.filter(
    (mem) => curUser_ID == mem.user_ID
  )[0].admin = false;

  this.save(cb);
  return true;
};

// Returnsthe group member object if admin is a member of this group.
// curMemberID = the User_ID of the group Member
// Callback Function = (err, result)
// result will always be null unless the user has passed the admid verification
GroupSchema.methods.verifyAdmin = function (curUserID, cb) {
  let res = this.findMemberByUser_ID(curUserID, cb);
  if (!res) {
    // User does not exist in the group
    return cb(this.ERROR_USER(curUserID), null);
  }
  if (!res.admin) return cb(this.ERROR_ADMIN, null);
  // should just be length 1 if admin found, but just in case...
  return cb(null, res);
};

// Returns member if member is a member of this group, empty string otherwise
// curMemberID is the member_ID
GroupSchema.methods.findMemberByUser_ID = function (user_ID, cb) {
  let res = this.group_members.filter((mem) => user_ID == mem.user_ID);
  // should just be length 1 if user found, but just in case...
  return res.length >= 1 ? res[0] : "";
};

//Find the group member with the supplied user_id in group_id
GroupSchema.statics.findMember = async function (user_ID, group_ID) {
  let member = await GroupMember.model.find({ user_ID, group_ID }).exec();
  return member;
};

// Group Method used to populate the Chore GroupMember data
GroupSchema.methods.populateChoreList = function (choreList, cb) {
  let ret = [];
  //Loop through the chore list
  for (let i = 0; i < choreList.length; i++) {
    // For each element add the data to the return object
    let obj = {
      // ...choreList[i],
      chore_name: choreList[i].chore_name,
      chore_description: choreList[i].chore_description,
      chore_assigned_user: this.group_members.id(
        choreList[i].chore_assigned_user
      ),
      chore_user_pool: choreList[i].chore_user_pool.map((user) =>
        this.group_members.id(user)
      ),
      chore_point_value: choreList[i].chore_point_value,
      chore_completion_status: choreList[i].chore_completion_status,
      _id: choreList[i]._id,
      chore_schedule: choreList[i].chore_schedule,
      chore_assigned_user_index: choreList[i].chore_assigned_user_index,
    };

    ret.push(obj);
  }
  return ret;
};

GroupSchema.methods.getChoresForMember = function (member, cb) {
  let ret = [];
  this.group_chores.forEach((chore) => {
    if (
      !chore.chore_assigned_user ||
      !chore.chore_assigned_user.equals(member._id)
    )
      return;
    console.log(chore);
    ret.push(chore);
  });
  return cb ? cb(null, ret) : ret;
};

// Removes a chore from the group array and returns the updated chore list.
GroupSchema.statics.removeChore = function (group_ID, chore_ID) {
  return this.findOneAndUpdate(
    { _id: group_ID },
    { $pull: { group_chores: { _id: chore_ID } } },
    { new: true }
  ).exec();
};

// Edits the chore name, description, and point value.
GroupSchema.statics.editChore = function (IDs, updates) {
  return this.findOneAndUpdate(
    { _id: IDs.group_ID, "group_chores._id": IDs.chore_ID },
    {
      $set: {
        "group_chores.$.chore_name": updates.chore_name,
        "group_chores.$.chore_description": updates.chore_description,
        "group_chores.$.chore_point_value": updates.chore_point_value,
      },
    },
    { new: true }
  ).exec();
};

GroupSchema.methods.rotateAssignedUser = function (chore_index, save) {
  //Set the assigned_user to the next user in the user_pool
  this.group_chores[chore_index].chore_assigned_user_index =
    (this.group_chores[chore_index].chore_assigned_user_index + 1) %
    this.group_chores[chore_index].chore_user_pool.length;
  this.group_chores[chore_index].chore_assigned_user = this.group_chores[
    chore_index
  ].chore_user_pool[this.group_chores[chore_index].chore_assigned_user_index];
  if (save) this.save();
};

//Function Used to check the completion for a given chore
GroupSchema.methods.checkCompletionStatus = function (chore_index, cb) {
  const chore = this.group_chores[chore_index];

  const currentDate = new Date(chore.chore_schedule.schedule_due_date);
  console.log(currentDate);
  switch (chore.chore_completion_status) {
    //The Chore has been completed
    // Check to see if the due_date has passed,
    // if so, then it reverts to 'TODO' and is passed to the next available user
    case "COMPLETED":
      if (Date.now() > currentDate) {
        //Due date has passed
        chore.chore_completion_status = "TODO";
        //Passing true will save the document after assigning the new user
        this.rotateAssignedUser(chore_index, false);
        chore.chore_schedule.schedule_due_date = this.getNewDueDate(chore);
      }
      break;
    // The Chore is waiting to be completed
    // Check to see if the due_date has passed,
    // if so, then it reverts to 'LATE'
    case "TODO":
      if (Date.now() > currentDate) {
        //Due date has passed
        chore.chore_completion_status = "LATE";
      }
      break;
    // If the Chore is late, then it will continue to be late
    // Until the next api/chores/complete call for the given chore
    case "LATE":
      return;
  }

  this.save(cb);
  return;
};

//Function used to set the new due date based off of the reccurance_type property
GroupSchema.methods.getNewDueDate = function (chore) {
  const wasLate = Date.now() > chore.chore_schedule.schedule_due_date;
  // If the chore was late, we do not want to set the next due date to another "LATE" date.
  // Get today's date if it was late.
  const currentDate = wasLate
    ? new Date()
    : new Date(chore.chore_schedule.schedule_due_date);
  switch (chore.chore_schedule.schedule_recurrence_type) {
    case "Daily":
      currentDate.setDate(currentDate.getDate() + 1);
      return currentDate;
    case "Weekly":
      currentDate.setDate(currentDate.getDate() + 7);
      return currentDate;
    case "Monthly":
      currentDate.setMonth(currentDate.getMonth() + 1);
      return currentDate;
    case "Never":
      return null;
  }
};

GroupSchema.methods.ERROR_ADMIN = function (curMemberID) {
  return `(Admin: ${curMemberID}) is not a member of group (Group: ${this.group_name}) or is not an admin`;
};

GroupSchema.methods.ERROR_MEMBER = function (curMemberID) {
  return `(Member: ${curMemberID}) is not a member of group (Group: ${this.group_name})`;
};

GroupSchema.methods.ERROR_USER = function (curUserID) {
  return `(Member: ${curUserID}) is not a member of group (Group: ${this.group_name})`;
};

const Group = mongoose.model("group", GroupSchema);
module.exports = Group;
