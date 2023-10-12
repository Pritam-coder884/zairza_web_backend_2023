const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    event_name : {
        type : String,
        required : true,
        unique : true
    },
    event_description : {
        type : String
    },
    total_enrolls : {
        type : Number,
        default : 0
    },
    event_date : {
        type : String,
        required : true
    },
    event_venue : {
        type : String,
        required : true
    },
    event_type : {
        required : true,
        type : String,
        enum : ["Tech Events", "Fun Events", "Workshops"]
    }
},{
    strict : true,
    versionKey : false,
    timestamps : true
})

eventSchema.virtual('users',{
    ref : 'User',
    localField : '_id',
    foreignField : 'events'
})

const Event = mongoose.model("Event", eventSchema)
module.exports = Event