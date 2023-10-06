const mongoose=require("mongoose");
const zenCodeSchema=new mongoose.Schema({
    num:{
        type:Number,
        default:0,
    }
},
{
    timestamps:true,
    versionKey:false
}

);
module.exports = mongoose.model("Zencode",zenCodeSchema);