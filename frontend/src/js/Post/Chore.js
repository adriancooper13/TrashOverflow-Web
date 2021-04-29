import React, { useState, useContext } from "react";
import "../../css/Post.css";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
// import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DoneAllOutlinedIcon from "@material-ui/icons/DoneAllOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
// import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import TodayOutlinedIcon from "@material-ui/icons/TodayOutlined";
import PostOption from "./PostOption";
// import MemberWindow from "../MemberWindow/MemberWindow";
import MyCalendar from "../MyCalendar";
// import SaveAltIcon from "@material-ui/icons/SaveAlt";
import MemberWindowFunc from "../MemberWindow/MemberWindowFunc";
import useComponentVisible from "../../hooks/useComponentVisible";
import { useChoreDeletion } from "../../hooks/useChoreDeletion";
import { useChoreEditor } from "../../hooks/useChoreEditor";
import { useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { GlobalContext } from "../../context/GlobalState";
import { useChoreScheduling } from "../../hooks/useChoreScheduling";
import { useChoreCompletion } from "../../hooks/useChoreCompletion";

function Chore(props) {
  //Prop Destructuring Definitions
  const {
    image,
    chore_name,
    description,
    points,
    memberPool,
    chore_ID,
    showGroup,
    // DO NOT REMOVE THIS UNUSED VARIABLE
    // ONCE IMPLE,ENTED IT WILL KEEP THE USERS FROM DOING CHORE OPERATION ON THE DASHBOARD
    isGroupView,
    chore_assigned_user_index,
    chore_completion_status,
    chore_schedule,
  } = props;

  //Get Group_ID from the URL Param
  const { group_ID } = useParams();
  const { currentGroup } = useContext(GlobalContext);

  // If a user isn't an admin, don't let them edit
  const isAdmin = currentGroup.isAdmin;

  //Visibility State
  const [hidden, setHidden] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState(
    chore_schedule || { recurrence: "Never" }
  );

  // Custom hook used to collapse on offClick
  // useComponentVisible returns => {ref, isComponentVisible, setIsComponentVisible}
  const recurrenceDropdownVis = useComponentVisible(false);
  const memberWindowVis = useComponentVisible(false);
  const calanderVis = useComponentVisible(false);
  const expandedVis = useComponentVisible(false);

  //Input State for Edits
  const initialValues = {
    chore_description: description,
    chore_name: chore_name,
    chore_user_pool: memberPool,
    chore_point_value: points,
    chore_assigned_user_index,
    chore_completion_status,
    chore_schedule,
  };

  const [values, setValues, resetValues] = useForm(initialValues);

  // For the assigned members we must start with the intial members array
  // We will handle adding and deleting from this array in the groupMember window Component
  const [newDate, setNewDate] = useState(null);

  // Chore API Hooks
  const removeChore = useChoreDeletion();
  const editChore = useChoreEditor(group_ID);
  const scheduleChore = useChoreScheduling(group_ID, GlobalContext);
  const completeChore = useChoreCompletion(group_ID, GlobalContext);

  function hideDelete() {
    setShowDelete(false);
    console.log("Hid Delete Button");
  }

  function expand() {
    //If we are already expanded ternimnate early
    if (expandedVis.isComponentVisible) return;
    //else, the chore is collapsed, and we should ensure the delete confirmation prompt is hidden
    expandedVis.setIsComponentVisible(true);
    hideDelete();
  }

  function toggleMembers() {
    memberWindowVis.setIsComponentVisible(!memberWindowVis.isComponentVisible);
  }
  function toggleCalendar() {
    calanderVis.setIsComponentVisible(!calanderVis.isComponentVisible);
    console.log("TOGGLE CAL");
  }
  function hideMessage() {
    hideDelete();
    setShowMessage(false);
  }
  function revealMessage() {
    setShowMessage(true);
  }
  function hidePoints() {
    hideDelete();
    setShowPoints(false);
  }
  function revealPoints() {
    setShowPoints(true);
  }
  function hideTitle() {
    hideDelete();
    setShowTitle(false);
  }
  function revealTitle() {
    setShowTitle(true);
  }

  function toggleDropdown(e) {
    e.preventDefault();
    recurrenceDropdownVis.setIsComponentVisible(
      !recurrenceDropdownVis.isComponentVisible
    );
  }

  function toggleDelete(e) {
    e.preventDefault();
    setShowDelete(!showDelete);
    setNewDate(!newDate);
    // console.log(showDelete);
    setShowMessage(true);
    setShowPoints(true);
    setShowTitle(true);
    recurrenceDropdownVis.setIsComponentVisible(false);
  }
  // const handleClickOutside = () => {
  //   memberWindowVis.setIsComponentVisible(false);
  //   setShowMessage(true);
  //   setShowPoints(true);
  //   setShowTitle(true);
  //   setShowDelete(false);
  // };

  // Function for when the user completes a chore
  // Currently linked to the Done Button
  const handleDone = (e) => {
    e.preventDefault();
    // If we are in the groupChoresView We wouldn't want to hide the chore after its completion
    if (!isGroupView) {
      setHidden(true);
    }
    completeChore({
      group_ID,
      chore_ID,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowMessage(true);
    setShowPoints(true);
    setShowTitle(true);
  };
  const handleDelete = (e) => {
    setHidden(true);
    removeChore({
      group_ID,
      chore_ID,
    });
  };
  // This is the function that will handle the saving of an edited chore
  const handleSave = (e) => {
    e.preventDefault();

    //We need to send an API req to save the chore server side
    editChore({
      group_ID,
      chore_ID,
      chore_name: values.chore_name,
      chore_description: values.chore_description,
      chore_point_value: values.chore_point_value,
    });

    //Setting the state for hidden and unhidden components
    expandedVis.setIsComponentVisible(false);
    setShowMessage(true);
    setShowPoints(true);
    setShowTitle(true);
    hideDelete();
    // the user is no longer editing
    setIsEditing(false);
  };

  // This is the function that will handle the cancel button while editing chores
  const handleCancel = (e) => {
    //Setting the state for hidden and unhidden components
    expandedVis.setIsComponentVisible(false);
    setShowMessage(true);
    setShowPoints(true);
    setShowTitle(true);
    hideDelete();
    // reset back to initial values
    resetValues(initialValues);
    console.log(values);

    // the user is no longer editing
    setIsEditing(false);
  };

  // Function called everytime a user clicks on a date on the calander component
  const selectDate = (newDate) => {
    //We need to send an API req to save the date server side
    scheduleChore({
      group_ID,
      chore_ID,
      schedule_due_date: newDate,
      schedule_recurrence_type: schedule.recurrence,
    });

    console.log("CHANGE");
    setSchedule({
      ...schedule,
      schedule_due_date: newDate,
    });
  };

  // This is the function that will handle the saving of an edited chore
  const selectRecurrance = (e) => {
    e.preventDefault();
    // set the reccurance to be the contents of the button that was pressed
    // console.log(e.target.innerText);
    scheduleChore({
      group_ID,
      chore_ID,
      schedule_recurrence_type: e.target.innerText,
    });

    setSchedule({
      ...schedule,
      schedule_recurrence_type: e.target.innerText,
    });
  };
  // Obejct representation of the due_date return by the database
  return (
    <div
      ref={expandedVis.ref}
      className={`row ${
        hidden
          ? "post-hidden"
          : expandedVis.isComponentVisible
          ? "post-expanded"
          : "post"
      }`}
    >
      <div className="post__top" onClick={expand}>
        <div className="post__topTitle">
          {showTitle || !isAdmin || !isGroupView ? (
            <h3 onClick={expandedVis.isComponentVisible ? hideTitle : null}>
              {chore_name === undefined
                ? "No Title"
                : // If the user has started editing, then display the edited changes, else show the RQ props vals
                isEditing
                ? values.chore_name
                : chore_name}
            </h3>
          ) : (
            <form>
              {/* This is the input for the chore_name */}
              {/* Notice how we set the value to be values.chore_name */}
              <input
                type="text"
                placeholder={chore_name}
                onBlur={() => revealTitle()}
                onFocus={() => {
                  setIsEditing(true);
                  hideTitle();
                }}
                tabIndex="0"
                name="chore_name"
                onChange={(e) => setValues(e)}
                value={values.chore_name}
              />
              <button onClick={handleSubmit} type="submit">
                Hidden submit
              </button>
            </form>
          )}
          <div className="post__points">
            <p>Points:</p>
            {showPoints || !isAdmin || !isGroupView ? (
              <p onClick={expandedVis.isComponentVisible ? hidePoints : null}>
                {points === undefined
                  ? "None"
                  : isEditing
                  ? values.chore_point_value
                  : points}
              </p>
            ) : (
              <form>
                <input
                  type="text"
                  placeholder={points}
                  onBlur={() => revealPoints()}
                  onFocus={() => {
                    setIsEditing(true);
                    hidePoints();
                  }}
                  tabIndex="0"
                  name="chore_point_value"
                  onChange={(e) => setValues(e)}
                  value={values.chore_point_value}
                />
                <button onClick={handleSubmit} type="submit">
                  Hidden submit
                </button>
              </form>
            )}
          </div>
        </div>
        {/* -------- Group and Date/Reccurance Information  -------------*/}

        {chore_schedule ? (
          <div className="post__topRight">
            {/* Group Name. only shown on feed page */}
            {showGroup ? <h4>{showGroup}</h4> : null}

            {/* Due Date */}
            {chore_schedule && chore_schedule.schedule_due_date && (
              <div className="post__topRightDate">
                <p>
                  Due:{" "}
                  {new Date(chore_schedule.schedule_due_date).toDateString()}
                </p>
              </div>
            )}

            {/* Reccurance */}
            {expandedVis.isComponentVisible ? (
              <div ref={recurrenceDropdownVis.ref} className="post__dropdown">
                <p>Repeats:</p>
                <div className="post__dropdownButton" onClick={toggleDropdown}>
                  <PostOption
                    Icon={ArrowDropDownOutlinedIcon}
                    title={schedule.schedule_recurrence_type}
                    color="grey"
                  />
                </div>
                {/* Reccurance Dropdown Menu*/}
                {recurrenceDropdownVis.isComponentVisible &&
                expandedVis.isComponentVisible ? (
                  <div className="post__dropdownMenu">
                    <button onClick={selectRecurrance}>Daily</button>
                    <button onClick={selectRecurrance}>Weekly</button>
                    <button onClick={selectRecurrance}>Monthly</button>
                    <button onClick={selectRecurrance}>Never</button>
                  </div>
                ) : null}
              </div>
            ) : (
              // Collapsed View
              <div className="post__topRightPoints">
                <p>Repeats: {schedule.schedule_recurrence_type}</p>
              </div>
            )}
          </div>
        ) : showGroup ? (
          <h4>{showGroup}</h4>
        ) : null}
      </div>
      {/*  ----- Chore Expanded Contents ----- */}
      <div
        className={`row ${
          expandedVis.isComponentVisible ? "post__body-expanded" : "post__body"
        }`}
        onClick={expand}
      >
        <div className="post__bodyDescription">
          <h4>Description</h4>
          <div className="post__bodyDescriptionMessage">
            {showMessage || !isAdmin || !isGroupView ? (
              <p onClick={hideMessage}>{values.chore_description}</p>
            ) : (
              <div className="post__bodyDescriptionMessageInput">
                <form>
                  <textarea
                    onBlur={() => revealMessage()}
                    onFocus={() => {
                      setIsEditing(true);
                      hideMessage();
                    }}
                    tabIndex="0"
                    name="chore_description"
                    onChange={(e) => setValues(e)}
                    value={values.chore_description}
                  >
                    {description}
                  </textarea>
                </form>
              </div>
            )}
          </div>
        </div>
        <div className="post__bodyRight">
          <div className="post__bodyRightMembers" onClick={toggleMembers}>
            <PostOption
              Icon={AccountCircleOutlinedIcon}
              title="Members"
              color="grey"
            />
          </div>
          {memberWindowVis.isComponentVisible && (
            <MemberWindowFunc
              refForward={memberWindowVis.ref}
              memberPool={memberPool}
              chore_ID={chore_ID}
              chore_assigned_user_index={chore_assigned_user_index}
            />
          )}
          {/* Calander Component */}
          <div className="post__bodyRightDate" onClick={toggleCalendar}>
            <PostOption Icon={TodayOutlinedIcon} title="Date" color="grey" />
          </div>
          {calanderVis.isComponentVisible && (
            <MyCalendar
              onChange={selectDate}
              value={
                chore_schedule && new Date(chore_schedule.schedule_due_date)
              }
              refForward={calanderVis.ref}
            />
          )}
          {/* Chore Complete (Done) Component */}
          <div className="post__bodyRightDone" onClick={handleDone}>
            <PostOption Icon={DoneAllOutlinedIcon} title="Done" color="grey" />
          </div>
          <div className="post__bodyRightDone">
            {showDelete ? (
              <div>
                <div
                  className="post__bodyRightDeleteConfirm"
                  onClick={handleDelete}
                >
                  <p>Delete?</p>
                </div>
                <div
                  className="post__bodyRightDeleteCancel"
                  onClick={toggleDelete}
                >
                  <p>Cancel</p>
                </div>
              </div>
            ) : (
              <div
                className="post__bodyRightDelete"
                onClick={(e) => toggleDelete(e)}
              >
                <PostOption
                  Icon={DeleteOutlineOutlinedIcon}
                  title="Delete"
                  color="grey"
                />
              </div>
            )}
          </div>
          <div className="post__bodyRightSave">
            {isEditing ? (
              <div>
                <div className="post__bodyRightSaveButton" onClick={handleSave}>
                  <p>Save</p>
                </div>
                <div
                  className="post__bodyRightDeleteCancel"
                  onClick={handleCancel}
                >
                  <p>Cancel</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="post__image">
        <img src={image} alt="" />
      </div>
    </div>
  );
}

export default Chore;
