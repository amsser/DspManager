'use strict';


var db = require('../lib/db').db,
    uc = require('underscore');


module.exports = function (app) {

    app.get('/report_hour', function (req, res) {
        
        res.render('report_hour');
        
    });

};
