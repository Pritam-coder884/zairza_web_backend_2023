const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    regdno: {
        type: Number,
        unique: true,
        required: true,
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
    password: {
        type: String,
        required: true,
    },
    zencode: {
        type: String,
        required : true,
        unique: true,
    },
    events : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event'
    }],
    image_path : {
        type : String,
        required : true
    }
},{
    strict: true,
    timestamps: true,
    versionKey: false
});

UserSchema.statics.generateZencode = async (num) => {
    let NewZenCode;

    if (num < 10) {
        NewZenCode = `Z202300${num}`;
    } else if (num < 100) {
        NewZenCode = `Z20230${num}`;
    } else {
        NewZenCode = `Z2023${num}`;
    }

    return NewZenCode
}

const User = mongoose.model("User", UserSchema);
module.exports = User