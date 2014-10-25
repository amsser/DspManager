var database = null;

exports.connect = function() {

	require("mongodb").MongoClient.connect('mongodb://dspm:passw0rd@124.232.133.207:27017/dspm', {

    //require("mongodb").MongoClient.connect('mongodb://dspm:passw0rd@182.92.3.24:27017/dspm', {

        server:{poolSize:20}

    }, function(err,db){

        if(err)throw err;

        database = db;

        console.info('mongodb connected');

    });

};


exports.db = function(){
    return database;
}

//module.exports = function(){
//    return database;
//}