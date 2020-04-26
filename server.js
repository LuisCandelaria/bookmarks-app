const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const jsonParser = bodyParser.json();
const uuid = require( 'uuid' );
const validateToken = require( './middleware/validateToken' );

const app = express();

app.use( morgan( 'dev' ) );
app.use( validateToken );

let bookmarks = [
    {
        id: uuid.v4(),
        title: "Title",
        description: "bookmark...",
        url: "www.google.com",
        rating: 10
    },
    {
        id: uuid.v4(),
        title: "Bookmark",
        description: "I don't know what a bookmark is",
        url: "www.computerhope.com/jargon/b/bookmark.htm",
        rating: 3
    },
    {
        id: uuid.v4(),
        title: "Youtube",
        description: "A bookmark or electronic bookmark is a method of saving a web page's address",
        url: "www.youtube.com",
        rating: 7
    },
    {
        id: uuid.v4(),
        title: "GitHub",
        description: "Github bookmark",
        url: "www.github.com",
        rating: 11
    }
];

app.get('/bookmarks', (req, res) =>{
    console.log("Getting the list.");
    return res.status( 200 ).json(bookmarks);
});

app.get( '/bookmark', (req, res) =>{
    console.log("Getting bookmarks by name.");
    console.log(req.query);

    let title = req.query.title;

    if( !title ){
        res.statusMessage = "The parameter 'title' is required.";
        return res.status( 406 ).end();
    }

    let result = bookmarks.find( (bookmark) =>{
        if( bookmark.title == title){
            return bookmark;
        }
    });

    if( !result ){
        res.statusMessage = `That bookmark 'title'=${title} is not found in the list.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json(result);
});

app.post( '/bookmark', jsonParser, (req, res) =>{
    console.log("Post a new bookmark.");
    console.log("Body", req.body);
    let title = req.body.title;
    let id  = uuid.v4();
    let description = req.body.description;
    let rating = req.body.rating;
    let url = req.body.url;

    if(!title || !description || !rating || !url){
        res.statusMessage = "The parameters must be sent in the body, one or more are missing.";
        return res.status( 406 ).end();
    }

    if(!(typeof(rating) === 'number')){
        res.statusMessage = "The 'rating' must be a number";
        return res.status( 406 ).end();
    }

    let nwbookmrk = {
        id : id,
        title : title,
        description : description,
        url : url,
        rating : rating
    }

    bookmarks.push(nwbookmrk);
    return res.status( 201 ).json({});
});

app.delete( '/bookmark/:id', (req, res) =>{
    console.log("Delete a bookmark.");
    console.log(req.params);

    let id = req.params.id;

    let bookmark = bookmarks.findIndex( (book) =>{
        if(book.id == id){
            return true;
        }
    });

    if(bookmark >= 0){
        bookmarks.splice(bookmark, 1);
        return res.status( 200 ).end();
    }
    else{
        res.statusMessage = "The bookmark is not found.";
        return res.status( 404 ).end();
    }
});

app.patch( '/bookmark/:id', jsonParser, (req, res) =>{
    console.log("Patch a bookmark.");
    console.log(req.params);

    let idP = req.params.id;
    let idB = req.body.id;

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!idB){
        res.statusMessage = "The 'id' in the body is missing.";
        return res.status( 406 ).end();
    }

    if(idB != idP){
        res.statusMessage = "The 'id' in the body should be the same as in the parameters.";
        return res.status( 409 ).end();
    }

    let bookmark = bookmarks.find( (book) =>{
        if(book.id == idB){
            if(title){
                book.title = title;
            }
            if(description){
                book.description = description;
            }
            if(url){
                book.url = url;
            }
            if(rating){
                book.rating = rating;
            }
            return book;
        }
    });

    return res.status( 202 ).json(bookmark);
});

app.listen( 8080, () =>{
    console.log("This server is running in port 8080.");
});

//http://localhost:8080

//http://localhost:8080/bookmarks

//http://localhost:8080/bookmark?title=

//http://localhost:8080/bookmark/:id

/*
    {
        "title": "New",
        "description": "New bookmark",
        "url": "www.hristu.net",
        "rating": 100
    }
*/