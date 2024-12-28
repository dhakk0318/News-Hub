const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({

    Title:{
        type:String,
        required:true,
    },
    Content:{
        type:String,
        required:true,
    },
    Category:{
        type:String,
        required:true,
    },
    Image:{
        type:String,
    },
    Views:{
        type:Number,
        default:0,
    },
    Likes:[{
        type: mongoose.Schema.Types.ObjectId, ref: "userId"
    }],
    LikeCount:{
        type:Number,
        default:0
    },
    Author:{
        type: mongoose.Schema.Types.ObjectId, ref: "Auther"
    },
    
},
{ timestamps:true}
);

const Article = mongoose.model("Article", articleSchema );

module.exports = Article;