const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const jsonParser = bodyParser.json();
const uuid = require( 'uuid' );
const validateToken = require( './middleware/validateToken' );
const mongoose = require( 'mongoose' );

const { Bookmark } = require( './models/bookmarkModel' );
const app = express();

app.use( morgan( 'dev' ) );
app.use( validateToken );
// Luis no modifiques master
/*let bookmarks = [
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
];*/

app.get('/bookmarks', (req, res) =>{
    console.log("Getting the list.");
    Bookmark
        .getAll()
        .then( result => {
            return res.status( 200 ).json(result);
        })
        .catch( err => {
            res.statusMessage = "Something went wrong with the Database.";
            return res.status( 500 ).end();
        })
});

app.get( '/bookmark', (req, res) =>{
    console.log("Getting bookmarks by name.");
    console.log(req.query);

    let title = req.query.title;

    if( !title ){
        res.statusMessage = "The parameter 'title' is required.";
        return res.status( 406 ).end();
    }

    Bookmark
        .getByTitle( title )
        .then( result => {
            if( !result ) {
                res.statusMessage = `There is no bookmark with thee title: '${title}'`;
                return res.status( 404 ).end();
            }
            else {
                return res.status( 200 ).json( result );
            }
        })
});

app.post( '/bookmarks', jsonParser, (req, res) =>{
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

    rating = Number( rating );

    if( isNaN( rating ) ){
        res.statusMessage = "The 'rating' must be a number";
        return res.status( 406 ).end();
    }

    let nwbookmrk = {
        id,
        title,
        description,
        url,
        rating
    }

    Bookmark
        .createBookmark( nwbookmrk )
        .then( result => {
            if( result.errmsg )
                return res.status( 400 ).end();
            return res.status( 201 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something went wrong with the Database.";
            return res.status( 500 ).end();
        })
});

app.delete( '/bookmark/:id', (req, res) =>{
    console.log("Delete a bookmark.");
    console.log(req.params);

    let id = req.params.id;

    Bookmark
        .deleteBookmark( id )
            .then( result => {
                if( !result ) {
                    res.statusMessage = "The bookmark doesn't exist.";
                    return res.status( 404 ).end();
                }
                else
                    return res.status( 200 ).end();
            })
            .catch( eerr => {
                res.statusMessage = "Something went wrong with the Database.";
                return res.status( 500 ).end();
            })
});

app.patch( '/bookmark/:id', jsonParser, (req, res) =>{
    console.log("Patch a bookmark.");
    console.log(req.params);

    let idP = req.params.id;
    let idB = req.body.id;

    if(!idB){
        res.statusMessage = "The 'id' in the body is missing.";
        return res.status( 406 ).end();
    }

    if(idB != idP){
        res.statusMessage = "The 'id' in the body should be the same as in the parameters.";
        return res.status( 409 ).end();
    }

    Bookmark
        .updateBookmark( req.body )
            .then( result => {
                return res.status( 202 ).json( result );
            })
            .catch( err => {
                return err;
            })
});

app.listen( 8080, () =>{
    console.log("This server is running in port 8080.");

    new Promise( ( resolve, reject ) => {
        const settings = {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex : true
        };
        mongoose.connect( 'mongodb://localhost/bookmarksdb', settings, ( err ) => {
            if( err )
                return eject( err );
            else {
                console.log("Database connected succesfully.");
                return resolve();
            }
        })
    })
});

//http://localhost:8080

//http://localhost:8080/bookmarks

//http://localhost:8080/bookmark?title

//http://localhost:8080/bookmark/:id

/*
    {
        "title": "New",
        "description": "New bookmark",
        "url": "www.hristu.net",
        "rating": "100"
    }
*/