var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;


var orderModel = function() {

    var orderSchema = mongoose.Schema({

        _id: ObjectId,
        Order_name: String,
        Active: String,
        Campin_id: String,
        Freq_ctr: String, //0,
        Freq: String, //5,
        Freq_timeout: String, //86400,
        L_time: [String], //16777215,
        Record_data: String,
        Is_dm: String,
        Classid_use: String,
        Retarget_use: String,
        Count_cost: String,
        Max_price: [String],
        Max_price_mo: String,
        Anonymous_filter: String,
        Gender_filter: String,
        Region_in: [String],
        Url_in: [String],
        Browser_in: [String],
        Operation_in: [String],
        Slot_visibility: [String],
        Url_price: [{
            Url: String,
            Price: String
        }],
        Slotid_price: [{
            Slotid: String,
            Price: String
        }],
        Adslotid_in: [String],
        Tags: [String],
        Delivery_type: String,
        advertiser: String,
        analyst: String,
        dspadmin: String

    });

    return mongoose.model('order', orderSchema);
};

module.exports = new orderModel();