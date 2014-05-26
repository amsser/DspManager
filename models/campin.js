

var mongoose = require('mongoose');


var campinModel = function () {

    var campinSchema = mongoose.Schema({

        orders: [Number],
        name : String,
        orderpay_type : String,
        order_num : Number

    });

    return mongoose.model('campin', campinSchema);

};

module.exports = new campinModel();