/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function addTag(fields) {
    fetch(`/api/bookmarks/${fields.id}/tags`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}
  
function deleteTag(fields) {
    fetch(`/api/bookmarks/${fields.id}/tags/${fields.tag}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
  