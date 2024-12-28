const User = require("../models/UserModels");
const Article = require("../models/ArticleModels");

exports.authorprofilepage = async function (req, res, next) {
  try {
    const author = req.user;
    const currentDate = new Date();
    const loginTime = currentDate.toLocaleTimeString();

    author.lastSignin = {
      date: currentDate,
      time: loginTime,
    };

    await author.save();

    res.render("authorprofile", {
      title: "author-profile",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.authorwritearticleget = async function (req, res, next) {
  try {
    res.render("writearticle", {
      title: "Write-Article",
      isLoggedIn: req.user ? true : false,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.authorwritearticlepost = async function (req, res, next) {
  try {
    const { Title, Content, Category } = req.body;
    const Author = req.user.id;
    console.log(req.file.filename);
    const Image = req.file.filename;

    const article = await Article.create({
      Title,
      Content,
      Category,
      Author: req.user.id,
      Image,
    });

    await article
      .save()
      .then(() => {
        res.redirect("/write-article");
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.authorfindarticleget = async function (req, res, next) {
  try {
    const articles = await Article.find();
    res.render("findarticle", {
      title: "find-Article",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      articles,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.authoreditarticle = async function (req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    res.render("editarticle", {
      title: "Edit-Article",
      isLoggedIn: req.user ? true : false,
      user: req.user,
      article,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.authoreditarticlepost = async function (req, res, next) {
  try {
    const article = await Article.findById(req.params.id);
    const { Title, Content, Category } = req.body;
    console.log(article);

    if (Title) {
      article.Title = Title;
    }
    if (Content) {
      article.Content = Content;
    }
    if (Category) {
      article.Category = Category;
    }

    await article.save();
    res.redirect("/authorprofile");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating user information" });
  }
};

exports.authordeletarticle = async function (req, res, next) {
  try {
    console.log(req.params.id);
    const articleid = req.params.id;
    const article = await Article.findOneAndDelete({_id:req.params.id});
    res.status(200).redirect("back");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the article" });
  }
};
