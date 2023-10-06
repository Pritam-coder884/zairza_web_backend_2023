const mongoose = require("mongoose");
const Zencode = require("./zencode")

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
    }]
},{
    strict: true,
    timestamps: true,
    versionKey: false
});

UserSchema.statics.generateZencode = async () => {
    let NewZenCode;
    let lastZenCode = await Zencode.findOne();

    if (!lastZenCode) {
        lastZenCode = new Zencode({ num: 0 });
    }
    lastZenCode.num = lastZenCode.num + 1;

    if (lastZenCode.num < 10) {
        NewZenCode = `Z202300${lastZenCode.num}`;
    } else if (lastZenCode.num < 100) {
        NewZenCode = `Z20230${lastZenCode.num}`;
    } else {
        NewZenCode = `Z2023${lastZenCode.num}`;
    }

    await lastZenCode.save()
    return NewZenCode
}

const User = mongoose.model("User", UserSchema);
module.exports = User