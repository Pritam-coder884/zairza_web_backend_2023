const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    event_name : {
        type : String,
        required : true,
        unique : true
    },
    event_description : {
        type : String,
        required : true,
    },
    total_enrolls : {
        type : Number,
        default : 0
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