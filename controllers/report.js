'use strict';


var ReportModel = require('../models/report');

var mongoose = require('mongoose');

var db = mongoose.connection.db;


module.exports = function (app) {

    var model = new ReportModel();


    app.get('/report', function (req, res) {


        mongoose.model("reportday").findOne({},function(err,docs){
            console.log(docs);
            console.log('find success');
        });
        
        res.render('report', model);
        
    });

};
