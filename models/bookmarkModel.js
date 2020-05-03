const mongoose = require( 'mongoose' );

const bookmarkSchema = mongoose.Schema({
    id : {
        type : String,
        require : true,
        unique : true
    },
    title : {
        type : String,
        require : true
    },
    description : {
        type : String,
        requre : true
    },
    url : {
        type : String,
        require : true
    },
    rating : {
        type : Number,
        require : true
    }
});

const bookmarkCollection = mongoose.model( 'bookmarksdb', bookmarkSchema);

const Bookmark = {
    createBookmark : function ( newBookmark ) {
        return bookmarkCollection
                .create(newBookmark)
                .then(create_newBookmark => {
                    return create_newBookmark;
                })
                .catch( err => {
                    return err;
                })
    },

    getAll : function() {
        return bookmarkCollection
                .find()
                .then( allBookmarks => {
                    return allBookmarks;
                })
                .catch( err => {
                    return err;
                })
    },

    getByTitle : function( title ) {
        const filter = { title : title };
        return bookmarkCollection
                .find(filter)
                .then(bookmark =>{
                    if(bookmark.length < 1)
                        return undefined;
                    else
                        return bookmark;
                })
                .catch( err => {
                    return err;
                })
    },

    deleteBookmark : function( bookmarkId ) {
        let filter = { id : bookmarkId };
        return bookmarkCollection
                .deleteOne( filter )
                    .then( result =>  {
                        if( result.n == 0 )
                            return false;
                        else
                            return true;
                    })
                    .catch( err => {
                        return err;
                    })
    },

    updateBookmark : function( bookmark ) {
        const id = { id : bookmark.id }
        return bookmarkCollection
                .updateOne( id, bookmark )
                    .then( result => {
                        return result;
                    })
                    .catch( err => {
                        return err;
                    })
    }
}

module.exports = { Bookmark };