const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    password:{
        type:String,
        min:5,
    },
    phone:{
        type:Number,
    },
    yearOfPassout:{
        type:Number,
    },
    isZairzaMember:{
        type:Boolean,
        default :false
    },
    
},
{
    timestamps:true,
    versionKey:false
}

);
module.exports = mongoose.model("User",UserSchema);