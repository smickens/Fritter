/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFollowsByUser(fields) {
    fetch(`/api/follows?account=${fields.id}`)
        .then(showResponse)
        .catch(showResponse);
}

function addFollow(fields) {
    fetch(`/api/follows/`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}
  
function deleteFollow(fields) {
    fetch(`/api/follows/${fields.friendId}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
  
function updateFollow(fields) {
    fetch(`/api/follows/${fields.friendId}`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}