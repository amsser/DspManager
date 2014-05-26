'use strict';


module.exports = function (app) {


    app.all('/login', function (req, res) {

        //model.messages = req.session['error'];
        res.render('login');
        
    });

    // app.post('/login', function (req, res) {

    //     passport.authenticate('local', {
    //         successRedirect: req.session.goingTo || '/profile',
    //         failureRedirect: "/login",
    //         failureFlash: true
    //     })(req, res);

    // });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};




