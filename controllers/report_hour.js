'use strict';


var db = require('../lib/db').db,
    uc = require('underscore');
var auth = require('../lib/auth');


module.exports = function (app) {

    app.get('/report_hour', auth.isAuthenticated(), function (req, res) {
        
        res.render('report_hour');
        
    });

};
