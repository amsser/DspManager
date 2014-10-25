'use strict'
var auth = require('../lib/auth');



module.exports = function (app) {

    app.all('/code', auth.isAuthenticated(), function (req, res) {

        res.redirect("/code/site");
        
    });

    app.all('/code/site', auth.isAuthenticated(), function (req, res) {

    	var result = {};
    	result["page"] = "site";
    	result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";

    	res.render("code", result);
    });

    app.all('/code/cate', auth.isAuthenticated(), function (req, res) {

    	var result = {};
    	result["page"] = "cate";
        result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";

    	res.render("code", result);
    });

    app.all('/code/trans', auth.isAuthenticated(), function (req, res) {

    	var result = {};
    	result["page"] = "trans";
        result["todaypay"] = 0;
        result["balance"] = 400;
        result["user"] = "演示账户";
        
    	res.render("code", result);
    });

};