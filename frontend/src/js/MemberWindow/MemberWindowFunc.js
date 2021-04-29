import React, { useContext } from "react";
import "../../css/MemberWindow.css";
import MemberWindowMember from "./MemberWindowMember";
import { GlobalContext } from "../../context/GlobalState";

function MemberWindowFunc(props) {
  const { currentGroup } = useContext(GlobalContext);
  const { memberPool, chore_ID, chore_assigned_user_index } = props;

  MemberWindowFunc.handleClickOutside = () => {
    this.props.hideMembers();
  };

  // componentDidMount() {
  //   this.initGroup();
  // }

  // function initGroup() {
  //   const context = this.context;
  //   const group = context.currentGroup;
  //   this.setState({ group });
  // }

  // Function to display the current assigned member
  // I also think that this function should remove the assigned member from the user pool to avoid recomputation
  function displayCurrentAssignedMember() {
    const index = chore_assigned_user_index;
    if (chore_assigned_user_index === -1) return;
    else
      return (
        <MemberWindowMember
          name={memberPool[index].user_name}
          assigned={true}
          key={memberPool[index]._id}
          member_ID={memberPool[index]._id}
          chore_ID={chore_ID}
          curAssigned={true}
        />
      );
  }

  // Display the members passed as props
  // These are the groupMembers who will at somepoint perform the chore
  // Thus, all of these members should be displayed with a checkmark nex to their name (assigned = {true})
  function displayAssignedMembers() {
    if (!Array.isArray(memberPool)) return;
    return memberPool.map((member) => {
      if (member._id === memberPool[chore_assigned_user_index]._id) return null;
      return (
        <MemberWindowMember
          name={member.user_name}
          assigned={true}
          key={member._id}
          member_ID={member._id}
          chore_ID={chore_ID}
          curAssigned={false}
        />
      );
    });
  }

  //Display the remaining members are are not assigned to the task
  // These members are displayed without a checkmark
  function displayRemainingMembers() {
    const allMembers = currentGroup.group_members;
    console.log(allMembers);
    console.log(memberPool);

    if (!Array.isArray(memberPool) || !Array.isArray(allMembers)) return;

    //Find the relative complement of the group_members and assigned_user_pool
    const remainingMembers = allMembers.filter((member) =>
      memberPool.every((assignedMember) => member._id !== assignedMember._id)
    );
    console.log(remainingMembers);
    return remainingMembers.map((member) => (
      <MemberWindowMember
        name={member.user_name}
        assigned={false}
        key={member._id}
        member_ID={member._id}
        chore_ID={chore_ID}
      />
    ));
  }

  return (
    <div ref={props.refForward}>
      <div className="memberWindow">
        <div className="memberWindow__top">
          <h4>Members</h4>
        </div>
        <div className="memberWindow__body">
          <div className="memberWindow__member">
            {displayCurrentAssignedMember()}
            {displayAssignedMembers()}
            {displayRemainingMembers()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberWindowFunc;
