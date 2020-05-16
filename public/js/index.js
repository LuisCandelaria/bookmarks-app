const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653'; 

function addBookmarkFetch( title, desc, url, rating ) {
    let urlPost = '/bookmarks';

    let data = {
        title : title,
        description : desc,
        url : url,
        rating : rating
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    fetch( urlPost, settings )
        .then( response => {
            if( response.ok )
                return response.json();
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            alert( err.message );
        })
}

function fetchBookmarkByTitle( searchTerm ) {
    let url = `/bookmark/?title=${searchTerm}`;

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    let bookmarks = document.getElementById( 'fetchBookmarks' );

    fetch( url, settings )
        .then( response => {
            if( response.ok )
                return response.json();
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            displayBookmarks( responseJSON );
        })
        .catch( err => {
            bookmarks.innerHTML = `<div class="errorMeessage"> ${ err.message } </div>`;
        })
}

function fetchBookmarks() {
    let url = '/bookmarks';

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    let bookmarks = document.getElementById( 'fetchBookmarks' );

    fetch( url, settings )
        .then( response => {
            if( response.ok )
                return response.json();
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            displayBookmarks( responseJSON );
        })
        .catch( err => {
            bookmarks.innerHTML = `<div class="errorMeessage"> ${ err.message } </div>`;
        })
}

function displayBookmarks( data ) {
    let bookmarks = document.getElementById( 'fetchBookmarks' );
    console.log( data );
    bookmarks.innerHTML = "";
    if( data[0] == undefined) {
        bookmarks.innerHTML = "There are no bookmarks";
    }
    let i = 0;
    while( data[i] != undefined ) {
        bookmarks.innerHTML += `
            <div class="bookmark">
                <label class="titleBookmark">${data[i].title}</label>
                <p class="descBookmark">
                    ${data[i].description}
                </p>
                <label class="urlBookmark">${data[i].url}</label>
                <p class="ratingBookmark">
                    ${data[i].rating}
                </p>
                <div class="buttons">
                    <button type="button" onclick="deleteBookmark(this)">Delete</button>
                    <button type="button" onclick="editBookmark(this)">Edit</button>
                </div>
                <input type="hidden" value="${data[i].id}">
            </div>
        `;
        i++;
    }
}

function deleteBookmarkFetch( id ) {
    let url = `/bookmark/${id}`;
    
    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    fetch( url, settings )
        .then( response => {
            if( response.ok ) {
                console.log("The bookmark is deleted.");
                fetchBookmarks();
            }
            else {
                throw new Error( response.statusText );
            }
        })
        .catch( err => {
            alert( err );
        })
}

function patchBookmarkFetch( id, title, desc, url, rating ) {
    let urlPatch = `/bookmark/${id}`;

    let data = {
        id : id,
        title : title,
        description : desc,
        url : url,
        rating : rating
    }

    let settings =  {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    fetch( urlPatch, settings )
        .then( response => {
            if( response.ok ) {
                console.log("The edits are complete.");
                fetchBookmarks();
                fixPatch();
            }
            else {
                throw new Error( response.statusText );
            }
        })
        .catch( err => {
            alert( err );
        })
}

function fixPatch() {
    let btnSubmit = document.getElementById( 'btnSubmit' );
    btnSubmit.classList.remove( 'hidden' );
    let btnEdit = document.getElementById( 'btnEdit' );
    btnEdit.classList.add( 'hidden' );
    let title = document.getElementById( 'inTitle' );
    let desc = document.getElementById( 'inDesc' );
    let url = document.getElementById( 'inUrl' );
    title.value = "";
    desc.value = "";
    url.value = "";
}

function deleteBookmark( btn ) {
    let id = btn.parentNode.nextSibling.nextSibling.value;
    deleteBookmarkFetch( id );
}

function editBookmark( btn ) {
    let id = btn.parentNode.nextSibling.nextSibling.value;
    let rating = btn.parentNode.previousSibling.previousSibling;
    let url = rating.previousSibling.previousSibling;
    let desc = url.previousSibling.previousSibling;
    let title = desc.previousSibling.previousSibling;
    let newtitle = document.getElementById( 'inTitle' );
    let newdesc = document.getElementById( 'inDesc' );
    let newurl = document.getElementById( 'inUrl' );
    let newrating = document.getElementById( 'inRating' );
    newtitle.value = title.innerText;
    newdesc.value = desc.innerText;
    newurl.value = url.innerText;
    newrating.value = rating.innerText;
    let btnSubmit = document.getElementById( 'btnSubmit' );
    btnSubmit.classList.add( 'hidden' );
    let btnEdit = document.getElementById( 'btnEdit' );
    btnEdit.classList.remove( 'hidden' );
    btnEdit.addEventListener( 'click', ( event ) => {
        patchBookmarkFetch( id, newtitle.value, newdesc.value, newurl.value, newrating.value );
    })
}

function init() {
    fetchBookmarks();
    let btnSubmit = document.getElementById( 'btnSubmit' );
    btnSubmit.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'inTitle' );
        let desc = document.getElementById( 'inDesc' );
        let url = document.getElementById( 'inUrl' );
        let rating = document.getElementById( 'inRating' );
        addBookmarkFetch( title.value, desc.value, url.value, rating.value );
        title.value = "";
        desc.value = "";
        url.value = "";
    });

    let searchBtn = document.getElementById( 'searchBtn' );
    searchBtn.addEventListener( 'click', ( event ) => {
        let searchTerm = document.getElementById( 'searchTerm' );
        fetchBookmarkByTitle(searchTerm.value);
        searchTerm.value = "";
    })
}

init();