'use strict';


var IndexModel = require('../models/index');
var auth = require('../lib/auth');


module.exports = function (app) {

    var model = new IndexModel();


    app.get('/', function (req, res) {
        
        //res.render('index', model);
        res.redirect('/login');
        
    });

};
