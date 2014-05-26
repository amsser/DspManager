'use strict';


var kraken = require('kraken-js'),
    passport = require('passport'),
    auth = require('./lib/auth'),
    User = require('./models/user'),
    flash = require('connect-flash'),
    express = require('express'),
    app = {};

var db = require('./lib/database');


require('./lib/db').connect();


app.configure = function configure(nconf, next) {

    //Configure the database
    db.config(nconf.get('databaseConfig'));

    //Tell passport to use our newly created local strategy for authentication
    passport.use(auth.localStrategy());

    //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(null, user);
        });
    });

    //Add two users to the system.
    var u1 = new User({
        name: 'Kraken McSquid',
        login: 'admin',
        password: 'admin',
        role: 'admin'
    });

    var u2 = new User({
        name: 'Ash Williams',
        login: 'user',
        password: 'user',
        role: 'user'
    });

    //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
    u1.save();
    u2.save();

    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.

    server.use(express.bodyParser());

    server.use(function(req, res, next){

      res.locals.active = req.path.split('/')[1] ;

      //console.log(res.locals.active);

      next();

    });

};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.

    server.use(passport.initialize());  //Use Passport for authentication
    server.use(passport.session());     //Persist the user in the session
    server.use(flash());                //Use flash for saving/retrieving error messages for the user
    server.use(auth.injectUser);        //Inject the authenticated user into the response context


};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.

};


if (require.main === module) {
    kraken.create(app).listen(function (err, server) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
