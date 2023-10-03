const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email: {
        type: String,
        unique: [true, "email already exists in database!"],
        lowercase: true,
        trim: true,
        required: [true, "email not provided"],
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: '{VALUE} is not a valid email!'
        }
    
    },
    password:{
        type:String,
        required:true,
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