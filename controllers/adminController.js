const User = require("../models/UserModels");
const Article = require("../models/ArticleModels");

exports.adminprofilepage = async function (req, res, next) {
  try {
    res.render("adminprofile", {
      title: "author-profile",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.adminfinduser = async function (req, res, next) {
  try {
    const users = await User.find({isAdmin:false});
    res.render("findusers", {
      title: "find-Article",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.admindeletuser = async function (req, res, next) {
  try {
    const userid = req.params.id;
    await User.findOneAndDelete({ id: userid });
    res.redirect("back");
  } catch (error) {
    res.send(error);
  }
};

exports.adminfindauthor = async function (req, res, next) {
  try {
    const authors = await User.find({ isAuthor: "true" });
    res.render("findauthor", {
      title: "find-Article",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      authors,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.adminterminateauthor = async function (req, res, next) {
  try {
    const authorid = req.params.id;
    const author = await User.findById(authorid);
    author.isAuthor = false;
    // Save the updated article to the database
    await author.save();
    res.redirect("/find-Authors");
  } catch (error) {
    console.log(error);
  }
};

exports.adminfeedauthor = async function (req, res, next) {
  try {
    const authors = await User.find({ isAuthor: "false" });
    res.render("makeauthor", {
      title: "find-Article",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      authors,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.adminmakeauthor = async function (req, res, next) {
  try {
    const authorid = req.params.id;
    const author = await User.findById(authorid);

    author.isAuthor = true;
    await author.save();

    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

exports.admindeleauthor = async function (req, res, next) {
  try {
    const authorid = req.params.id;
    await User.findById({ id: authorid });
    if (!author) {
      return res.json({ error: "Author not found" });
    }
    res.redirect("/find-Author");
  } catch (error) {
    console.log(error);
  }
};

exports.adminarticlereach = async function (req, res, next) {
  try {
    const articles = await Article.find().sort({ Views: -1 });
    res.render("articlereach", {
      title: "find-Article",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      articles,
    });
  } catch (error) {
    console.log(error);
  }
};

