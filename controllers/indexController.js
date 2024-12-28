var express = require("express");
var router = express.Router();
const User = require("../models/UserModels");
const passport = require("passport");
const localStratagy = require("passport-local");
const Article = require("../models/ArticleModels");
passport.use(new localStratagy(User.authenticate()));
const imageupload = require("../helper/multer").single("image");
const proimageupload = require("../helper/profileMulter").single("avatar");
const fs = require("fs");

exports.homepage = async function (req, res, next) {
  try {
    const articles = await Article.find().sort({ _id: -1 }).limit(20);
    const toparticles = await Article.find().sort({ views: -1 }).limit(5);
    res.render("index", {
      title: "News Hub",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      articles,
      toparticles,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.aboutpage = async function (req, res, next) {
  try {
    res.render("about", {
      title: "About",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.contactpage = async function (req, res, next) {
  try {
    res.render("contacts", {
      title: "About",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.siginiget = async function (req, res, next) {
  try {
    if(req.user) {
      return res.redirect("/profile")
    }
    res.render("signin", { title: "Signin" });
  } catch (error) {
    console.log(error);
  }
};

exports.signupget = async function (req, res, next) {
  try {
    res.render("signup", { title: "signup" });
  } catch (error) {
    console.log(error);
  }
};

exports.signuppost = async function (req, res, next) {
  try {
    const { username, email, password } = req.body;
    await User.register({ username, email }, password)
      .then((user) => {
        res.redirect("/signin");
      })
      .catch((err) => res.send(err));
  } catch (error) {
    console.log(error);
  }
};

exports.usersignout = async function (req, res, next) {
  try {
    req.logout(() => {
      res.redirect("/signin");
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while Signout" });
  }
};

exports.forgetpasswordget = async function (req, res, next) {
  try {
    res.render("forgetpassword", { title: "Forgetpassword" });
  } catch (error) {
    console.log(error);
  }
};

exports.articalCategory = async function (req, res, next) {
  try {
    const Categoryname = req.params.Category;
    const articles = await Article.find({ Category: Categoryname }).sort({
      _id: -1,
    });
    const Toparticles = await Article.find({ Category: Categoryname })
      .sort({ Views: -1 })
      .limit(10);
    res.render("articles", {
      title: "Articles",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      articles,
      Toparticles,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.articalget = async function (req, res, next) {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    article.Views += 1;
    await article.save();
    res.render("article", {
      title: "News Aritcle",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      article,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateuserepage = async function (req, res, next) {
  try {
    res.render("updateuser", {
      title: "Update user",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updatepost = async function (req, res, next) {
  try {
    const user = req.user;
    const { email, status, username } = req.body;
    console.log(user);
    console.log(req.body);

    // Find the user by ID
    // const user = await User.findById(id);

    // Update the user information if provided
    if (email) {
      user.email = email;
    }
    if (status) {
      user.status = status;
    }
    if (username) {
      user.username = username;
    }
    // Save the updated user to the database
    await user.save();

    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
};

exports.profileupload = async function (req, res, next) {
  proimageupload(req, res, function (err) {
    if (err) {
      console.log("ERROR>>>>>", err.message);
      res.send(err.message);
    }
    if (req.file) {
      if (req.user.avatar !== "default.png") {
        fs.unlinkSync("./public/images/profileimages/" + req.user.avatar);
      }
      req.user.avatar = req.file.filename;
      req.user
        .save()
        .then(() => {
          // res.redirect("/update/" + req.user._id);
          res.redirect("/profile");
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};

exports.likeartical = async function (req, res, next) {
  try {
    const userId = req.user.id; 
    // Check if the user and article exist
    const user = await User.findById(userId);
    const article = await Article.findById(req.params.id);

    if (!user || !article) {
      return res.status(404).json({ error: "User or article not found" });
    }

    // Add the article's ID to the user's liked articles array
    user.articles.push(article._id);
    await user.save();

    res.redirect(`/articles/${article._id}`);
  } catch (error) {
    console.log(error);
  }
};

// exports.savearticle = async function (req, res, next) {
//   try {
//     const userId = req.user.id;

//     // Check if the user and article exist
//     // const user = await User.findById(userId);
//     const article = await Article.findById(req.params.id);

//     if (!user || !article) {
//       return res.status(404).json({ error: "User or article not found" });
//     }

//     // Add the article's ID to the user's liked articles array
//     user.SaveArticals.push(article._id);
//     await user.save();

//     res.redirect(`/articles/${article._id}`);
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.savearticle = async function (req, res, next) {
  try {
    const user = req.user;
    const issave = user.SaveArticals.find((e) => (e == req.params.id))
    console.log(issave)
    if(issave){
      return res.json({massage:"already save that article"})
    }
    user.SaveArticals.push(req.params.id)
    await user.save();
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

exports.showsavedarticle = async function (req, res, next) {
  try {
   const article = await User.findById(req.user._id).populate("SaveArticals");
   await 
    res.render("savedaritcle",{
      title:"Saved Articles",
      article
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.profilepage = async function (req, res, next) {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// };
