/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllPersonas(fields) {
    fetch(`/api/personas`)
        .then(showResponse)
        .catch(showResponse);
}

function viewPersonaWithName(fields) {
    fetch(`/api/personas?name=${fields.name}`)
        .then(showResponse)
        .catch(showResponse);
}

function addPersona(fields) {
    fetch(`/api/personas/`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}
  
function deletePersona(fields) {
    fetch(`/api/personas/${fields.name}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}