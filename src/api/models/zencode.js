const mongoose=require("mongoose")

const ZencodeSchema=new mongoose.Schema({
    num : {
        type : Number,
        default : 0
    }
},{
    strict : true,
    timestamps:true,
    versionKey:false
});

const Zencode = mongoose.model("Zencode",ZencodeSchema);
module.exports = Zencode