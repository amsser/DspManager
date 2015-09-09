'use strict';

var ObjectID = require('mongodb').ObjectID;
var mongo = require('../lib/db');
var db = require('../lib/db').db;
var _ = require('underscore');
var co = require('co');
var auth = require('../lib/auth');
var bcrypt = require('bcrypt'),
    nconf = require('nconf'),
    DIFFICULTY = (nconf.get('auth') && nconf.get('bcrypt').difficulty) || 8;

module.exports = function(app) {

    app.get('/user', auth.isAuthenticated(), function(req, res) {

        res.redirect("/user/list");

    });

    app.get('/user/list', auth.isAuthenticated(), function(req, res) {

        var uid = req.user.login;

        console.log(uid);

        var rs = {};

        var cd = {};

        if (req.user.role === 'dspadmin') {
            cd.dspadmin = uid;
        }else if (req.user.role === 'admin') {
            cd = {};
        }

        co(function * () {

            var result = yield mongo.query('users', cd, {
                savetime: -1
            });

            rs.data = result;

            console.log(rs);

            res.render('user_list', rs);

        })();

    });


    app.get('/user/create', auth.isAuthenticated(), function(req, res) {

        co(function * () {

            var edit_uid = req.param("login");

            var rs = {};

            //获得analystto array 。 也就是创建的用户可以属于那些用户
            //首先是创建者本身，然后是属于创建者的，GroupAdmin 角色和 Analyst 角色的用户。
            var analysts = [req.user];

            var cd = {};

            if (req.user.role === 'dspadmin') {
                cd.dspadmin = req.user.login;
            }else if (req.user.role === 'admin') {
                cd = {};
            }

            var result = yield mongo.query('users', cd, {
                savetime: -1
            });

            var group_result = _.groupBy(result, function(r) {
                return r.role;
            });

            console.log(group_result);

            rs.analysts = JSON.stringify(group_result.analyst);
            rs.dspadmins = JSON.stringify(group_result.dspadmin);

            console.log(rs);

            if (edit_uid) {

                var edit_user_result = yield mongo.query('users', {
                    login: edit_uid
                });

                rs.edit_user = edit_user_result[0];
                console.log(rs);
                res.render('user_create', rs);

            } else {

                res.render('user_create', rs);

            }


        })();

    });

    app.all('/user/save', auth.isAuthenticated(), function(req, res) {

        co(function * () {

            var user = req.body;

            user.dspadmin = req.user.login;

            console.log(user);

            if (user._id && user._id !== '') {

                user._id = new ObjectID(user._id);

            } else {
                user._id = new ObjectID();
            }

            if (user.password !== '') {
                var hashedPwd = bcrypt.hashSync(user.password, DIFFICULTY);
                user.password = hashedPwd;
            } else {
                delete user.password;
            }

            var result = yield mongo.save('users', user);

            console.log(result);

            res.redirect("/user/list");

        })();

    });

    app.get('/user/remove', auth.isAuthenticated(), function(req, res) {

        var id = req.param('login');

        co(function * () {

            var result = yield mongo.remove('users', {
                login: id
            });

            res.redirect("/user/list");

        })();

    });

};