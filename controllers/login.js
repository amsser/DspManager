'use strict';

var LoginModel = require('../models/login'),
    passport = require('passport');
var auth = require('../lib/auth');


module.exports = function (app) {

    var model = new LoginModel();


    app.get('/login', function (req, res) {

        //Include any error messages that come from the login process.
        model.messages = req.flash('error');
        res.render('login', model);

    });

    app.post('/login', function (req, res) {

        passport.authenticate('local', {
            successRedirect: req.session.goingTo || '/campin',
            failureRedirect: "/login",
            failureFlash: true
        })(req, res);

    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};




