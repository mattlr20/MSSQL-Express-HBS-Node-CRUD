var express = require('express');
var router = express.Router();
//var mongo = require('mongodb');
var assert = require('assert');
var sql = require('mssql');
var config = {
        user: '',
        password: '',
        server: '', 
        database: '' 
    };

//var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {

    var dbConn = new sql.Connection(config);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        request.query("select ID, title, author, content from NodeProject order by ID").then(function (recordSet) {
            console.log(recordSet);
            res.render("index", {items: recordSet}); 
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
    
});

router.post('/insert', function(req, res, next) {

    var dbConn = new sql.Connection(config);
    dbConn.connect().then(function () {
        var transaction = new sql.Transaction(dbConn);
        transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            request
            .input('title', sql.VarChar, req.body.title)
            .input('content', sql.VarChar, req.body.content)
            .input('body', sql.VarChar, req.body.author)
            .query("Insert into NodeProject (title,author,content) values (@title,@content,@body)")
        .then(function () {
                transaction.commit().then(function (recordSet) {
                    console.log(recordSet);
                    dbConn.close();
                }).catch(function (err) {
                    //9.
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                });
            }).catch(function (err) {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
            });
            
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });

    res.redirect('/');

});

router.post('/update', function(req, res, next) {

    var dbConn = new sql.Connection(config);
    dbConn.connect().then(function () {
        var transaction = new sql.Transaction(dbConn);
        transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            request
            .input('title', sql.VarChar, req.body.title)
            .input('content', sql.VarChar, req.body.content)
            .input('author', sql.VarChar, req.body.author)
            .input('ID', sql.Int, req.body.ID)
            .query("UPDATE NodeProject set title=@title,content=@content,author=@author where ID = @ID")
        .then(function () {
                transaction.commit().then(function (recordSet) {
                    console.log(recordSet);
                    dbConn.close();
                }).catch(function (err) {
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                });
            }).catch(function (err) {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
            });
            
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });

});

router.post('/delete', function(req, res, next) {

    var dbConn = new sql.Connection(config);
    dbConn.connect().then(function () {
        var transaction = new sql.Transaction(dbConn);
        transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            request
            .input('ID', sql.Int, req.body.ID)
            .query("DELETE FROM NodeProject WHERE ID = @ID")
        .then(function () {
                transaction.commit().then(function (recordSet) {
                    console.log(recordSet);
                    dbConn.close();
                }).catch(function (err) {
                    //9.
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                });
            }).catch(function (err) {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
            });
            
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
    
})

// router.get('/get-data', function(req, res, next) {
//     var resultArray = [];
//     mongo.connect(url, function(err, db){
//         assert.equal(null, err);
//         var cursor = db.collection('user-data').find();
//         cursor.forEach(function(doc, err) {
//             assert.equal(null, err);
//             resultArray.push(doc);
//         }, function(){
//             db.close();
//             res.render('index', {items: resultArray});
//         });
//     });
// });

// router.post('/insert', function(req, res, next) {
//     var item = {
//         title: req.body.title,
//         content: req.body.content,
//         author: req.body.author
//     };

//     mongo.connect(url, function(err, db){
//         assert.equal(null, err);
//         db.collection('user-data').insertOne(item, function(err, result){
//             assert.equal(null, err);
//             console.log('Item inserted');
//             db.close();
//         });
//     });

//     res.redirect('/');
// });

// router.post('/update', function(req, res, next) {

// });

// router.post('/delete', function(req, res, next) {

// });

module.exports = router;
