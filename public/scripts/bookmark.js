/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllBookmarks(fields) {
    fetch('/api/bookmarks')
        .then(showResponse)
        .catch(showResponse);
}

function viewAllBookmarksWithTag(fields) {
    fetch(`/api/bookmarks?tag=${fields.tag}`)
        .then(showResponse)
        .catch(showResponse);
}

 function addBookmark(fields) {
    fetch('/api/bookmarks', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
  }
  
  function deleteBookmark(fields) {
    fetch(`/api/bookmarks/${fields.id}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
  }
  