import React, {useState, useContext} from 'react'
import { GlobalContext } from '../context/GlobalState'
const axios = require('axios').default;

//Capitalization
export default function GroupItem(props) {

//Bring in the userState form the global context
const {user, jwt, storeJWT, storeGroups} = useContext(GlobalContext);

//Function Called for a user to remove him/her self from a group
function leaveGroup(group_ID){
    //Make the login API call
    axios.post('/api/groups/leave', {
        group_ID
    })
    .then(res => {
        if(res.data.error !== '') throw res.data.error
        console.log(res);
        if('token' in res.data)
            storeJWT(res.data.token);
        storeGroups(res.data.groups);
    })
    .catch(err => {
        console.log(err);
    })
    return;
}

    return (
        <>
            <h2>{props.group.group_name}</h2>
            <p>{props.group.group_description}</p>
            {/* remove the group on click of this button */}
            <button onClick={() => leaveGroup(props.group._id)}>x</button>
        </>
    )
}
