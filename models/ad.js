

var mongoose = require('mongoose');


var adModel = function () {

    var adSchema = mongoose.Schema({

        _id : mongoose.Schema.Types.ObjectId,
        order_id : [Number],
        name : String,
        size : String,
        adtype : Number,
        duration : Number,
        mimes : Number,
        channel : String,
        cs : String,
        tmp_name : String,
        html_snippet : String,
        priority : Number,
        thirdparty_url : String,
        landingpage_url : String,
        category : String,
        category_product : String,
        attribute : Number,
        buyer_creative_id : Number

    });

    return mongoose.model('ad', adSchema);

};

module.exports = new adModel();