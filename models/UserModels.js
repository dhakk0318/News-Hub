const mongoose = require("mongoose");
const passport = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        uniqur: true,
    },
    password: String,
    code: String,
    isAdmin:{
        type:Boolean,
        default: false,
    },
    isAuthor:{
        type:Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "default.png",
    },
    likeArticals: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article' 
    }],
    SaveArticals: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article' 
    }],
    lastSignin:{
        date: {
            type: Date,
            default: null
        },
        time: {
            type: String,
            default: null
        }
    },
    lastSignout:{
        date: {
            type: Date,
            default: null
        },
        time: {
            type: String,
            default: null
        }
    },
    status:{
        type:String
    }, 
    code:{
        type:Number
    },
    token:Number,
},
{ timestamps: true }
);

userSchema.plugin(passport);

const user = mongoose.model("user", userSchema);

module.exports = user;