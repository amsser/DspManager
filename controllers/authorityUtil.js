var ObjectID = require('mongodb').ObjectID;
var co = require('co');
var mongo = require('../lib/db');


module.exports = {

    genItemIfNull: function(item) {

        if (!item) {
            item = {};
        }

        return item;

    },


    genConditionByRole: function(user, cd) {

        cd = this.genItemIfNull(cd);

        if (user.role === 'advertiser') {
            cd.uid = user.login;
        } else if (user.role === 'analyst') {
            cd.analyst = user.login
        }

        return cd;

    },

    genID: function(item) {

        item = this.genItemIfNull(item);

        if (item._id && item._id != '') {
            item._id = new ObjectID(item._id);
        } else {
            delete item._id;
        }

        return item

    },

    setBelongsOfAdvertiser: function(item, user) {

        //uid is advertiser id
        item.uid = user.login;
        item.advertiser = user.login;
        //if (user.analyst) {
        item.analyst = user.analyst;
        //}

        console.log(item);

        return item;

    },

    setBelongsOfAnalyst: function(item, user) {

        //uid is should be advertiserid.
        item.uid = item.advertiser;
        item.analyst = user.login;

        return item;

    },

    setBelongs: function(item, user) {

        item = this.genItemIfNull(item);

        if (user.role === 'analyst') {
            item = this.setBelongsOfAnalyst(item, user);
        } else if (user.role === 'advertiser') {
            console.log("---------------");
            item = this.setBelongsOfAdvertiser(item, user);
        }

        console.log(item);

        return item;

    },

    getAdvertisersOfAnalyst: function(item, user) {

        return function(fn) {

            co(function * () {

                var cd = {
                    role: 'advertiser',
                    analyst: user.login
                };

                var advertisers = yield mongo.query('users', cd, {
                    savetime: -1
                });

                item.advertisers = advertisers;

                return item;

            })(fn);

        }

    },

    getAdvertisers: function(item, user) {

        var authUtil = this;

        item = this.genItemIfNull(item);

        return function(fn) {

            co(function*() {

                if (user.role === 'analyst') {

                    item = yield authUtil.getAdvertisersOfAnalyst(item, user);

                }

                console.log(item);

                return item;

            })(fn);

        }

    },
    getAdvertisersByJson: function(item, user) {

        this.getAdvertisers(item, user, function(err, item) {

            if (item.advertisers) {
                item.advertisers = JSON.stringify(item.advertisers);
            }

            cb(null, item);

        });

    }

};