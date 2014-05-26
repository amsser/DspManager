

var mongoose = require('mongoose');


var orderModel = function () {

    var orderSchema = mongoose.Schema({

        _id : mongoose.Schema.Types.ObjectId,
        campin_id : [Number],
        advertiser_id : Number,
        exchange : Number,
        max_price_g : Number,
        max_price_t : Number,
        max_price_tc : Number,
        max_price_mz : Number,
        max_price_ay : Number,
        max_price_s : Number,
        max_price_sh : Number,
        record_data : Boolean,
        is_dm : Boolean,
        freq_ctr : Number,
        freq_timeout : Number,
        freq : Number,
        l_time : Number,
        classid_use : Boolean,
        retarget_use : Boolean,
        advert_X : Number,
        ad_X_is_Multi : Boolean,
        sys_X : Number,
        sys_X_is_Multi : Boolean,
        anonymous_filter : Number,
        gender_filter : String,
        count_cost : Number,
        region_in : [Number],
        region_out : [Number],
        media_type_in : [Number],
        media_type_out : [Number],
        url_in : [String],
        url_out : [String],
        os_in : [String],
        os_out : [String],
        browser_in : [String],
        browser_out : [String],
        slot_visibility : Number,
        slot_view_type : Number,
        retarget_in : [String],
        retarget_out : [String],
        url_all_in : [String],
        adslotid_in : [String],
        adslotid_out : [String],
        classid_in : [String],
        url_price : Number,
        slotid_price : Number

    });

    return mongoose.model('order', orderSchema);
};

module.exports = new orderModel();