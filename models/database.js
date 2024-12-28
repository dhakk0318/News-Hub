const mongoose = require("mongoose");
mongoose.set('strictQuery', true);


mongoose.connect("mongodb://127.0.0.1:27017/news")
.then(()=>console.log("databace id connected"))
.catch(()=>console.log(err));