

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;


var orderModel = function () {

    var orderSchema = mongoose.Schema({

            _id : ObjectId,
            Order_name: String,
            Active:String,
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
            Max_price_mo: String,
            Anonymous_filter: String,
            Gender_filter: String,
            Region_in: [String],
            Url_in: [String],
            Browser_in: [String],
            Operation_in: [String],
            Slot_visibility: [String],
            Url_price: [{ Url: String, Price: String }],
            Slotid_price: [{ Slotid: String, Price: String }],
            Adslotid_in: [String],
            Tags:[String],
            Delivery_type:String

        // campin_id : String,
        // advertiser_id : Number,
        // money : Number,
        // exchange : [Number],
        // max_price_g : Number,
        // max_price_t : Number,
        // max_price_tc : Number,
        // max_price_mz : Number,
        // max_price_ay : Number,
        // max_price_s : Number,
        // max_price_sh : Number,
        // record_data : Boolean,
        // is_dm : Boolean,
        // freq_ctr : Number,
        // freq_timeout : Number,
        // freq : Number,
        // l_time : Number,
        // classid_use : Boolean,
        // retarget_use : Boolean,
        // advert_X : Number,
        // ad_X_is_Multi : Boolean,
        // sys_X : Number,
        // sys_X_is_Multi : Boolean,
        // status : Number,
        // anonymous_filter : Number,
        // gender_filter : String,
        // region_in : [Number],
        // region_out : [Number],
        // media_type_in : [Number],
        // media_type_out : [Number],
        // url_in : [String],
        // url_out : [String],
        // os_in : [String],
        // os_out : [String],
        // browser_in : [String],
        // browser_out : [String],
        // slot_visibility : Number,
        // slot_view_type : Number,
        // retarget_in : [String],
        // retarget_out : [String],
        // url_all_in : [String],
        // adslotid_in : [String],
        // adslotid_out : [String],
        // classid_in : [String],
        // url_price : Number,
        // slotid_price : Number,
        // ad_ids : [Number]

    });

    return mongoose.model('order', orderSchema);
};

module.exports = new orderModel();