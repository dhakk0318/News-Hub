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
const Nodemailer = require("nodemailer")

const { 
  homepage,
  aboutpage,
  contactpage, 
  siginiget, 
  signupget, 
  signuppost, 
  forgetpasswordget, 
  articalCategory,
  articalget,
  updateuserepage,
  updatepost,
  profileupload,
  savearticle,
  usersignout
} = require("../controllers/indexController");

const { 
  authorprofilepage, 
  authorwritearticleget, 
  authorwritearticlepost, 
  authorfindarticleget, 
  authoreditarticle,
  authoreditarticlepost,
  authordeletarticle,
} = require("../controllers/autherController");

const { 
  adminprofilepage, adminfinduser, admindeletuser, adminfindauthor, adminterminateauthor, adminfeedauthor, adminmakeauthor, admindeleauthor, adminarticlereach,
} = require("../controllers/adminController");

/* GET home page. */
router.get("/",homepage);

/* GET about page. */
router.get("/About", aboutpage);

/* GET contacts page. */
router.get("/Contacts", contactpage);

/* GET Signin page. */
router.get("/signin", siginiget);

/* post Signin route with Passport authentication . */
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
  }),
  function (req, res, next) {}
);

/* GET Signup page. */
router.get("/signup", signupget);

// POST Sighup route.
router.post("/signup", signuppost);

//GET Logout
router.get("/logout", isLoggedIn, usersignout);


/* GET forgetpassword page. */
router.get("/forgetpassword", forgetpasswordget);

/* POST forgetpassword Route. */
router.post("/send-mail", async function (req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({message:"user not found with this email addres"})

  var code = `${Math.floor(Math.random() * 9000 + 1000)}`;

  //------ NODEMAILER

  const transport = Nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRES,
      pass: process.env.MAIL_PASSWORD
    }
  });
  
  
  const mailOption = {
  from: "News Hub Pvt. Ltd.<arpitsahu358@gmil.com>",
  to: req.body.email,
  subject: "password reset link",
  text: "do not sherar this with anyone",
  html: `<p>Do not share this Code to anyone.</p><h1>${code}</h1>`,
  };

  transport.sendMail(mailOption, async  (err, info) =>{
    if (err) return res.send(err);


    await User.findByIdAndUpdate(user._id, {code});
  
    res.redirect("/code/" + user._id);
  })
});



/* GET CODE page. */
router.get("/code/:id", async function (req, res, next) {
  const {email} = await User.findById(req.params.id);
  res.render("getcode", { title: "code", id: req.params.id , email:email });
});


// POST CODE ROUTE.
router.post("/code/:id", async function (req, res, next) {
  const user = await User.findById(req.params.id);
  if (user.code == req.body.code) {
    user.code = "";
    user.token = 1;
    await user.save();
    res.redirect("/changepassword/" + user._id);
  } else {
    res.send("invalit code");
  }
});

router.get("/changepassword/:id", async function (req, res, next) {
  const user = await User.findById(req.params.id)
  if(user.token == 1){
    res.render("changepassword", { title: "Forgetpassword", id:req.params.id });
  } 
  else{
    res.json({message:"you are not Authenticated to access Change password page."})
  }
});

router.post("/changepassword/:id", async function (req, res, next) {
  let currentUser = await User.findOne({ _id: req.params.id });
  currentUser.setPassword(req.body.password, async (err, info) => {
    if (err) res.send(err);
    currentUser.token = 0;
    await currentUser.save();
    res.redirect("/signin");
  });
});

/* GET alticals page. */
router.get("/articles/:Category", isLoggedIn, articalCategory);


// GET article page throw id
router.get("/article/:id", isLoggedIn, articalget);

// router.get('/articles', function(req, res, next) {
//   res.render('articles', { title: 'News' });
// });

/* GET profile page. */
router.get("/profile", isLoggedIn, function (req, res, next) {
  if (req.user.isAdmin) {
    return res.redirect("/adminProfile");
  }
  if (req.user.isAuthor) {
    return res.redirect("/authorprofile");
  }
  console.log(req.user);
  res.render("profile", {
    title: "Profile",
    isLoggedIn: req.user ? true : false,
    user: req.user,
  });
});

/* Post Write Artical page for Author. */
router.post("/profile-upload", isLoggedIn, profileupload);

router.get("/updateuser", isLoggedIn,updateuserepage);

// Route to handle updating user information
router.post("/updateuser", isLoggedIn, updatepost );

// Route to save the aritcle
router.get("/save/:id", isLoggedIn, savearticle );


// user logout
router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/signin");
  });
});

// Route to handle liking an article
router.post("/articles-like/:id", isLoggedIn, async (req, res) => {
  try {
      const userId = req.user.id; // Assuming you have implemented user authentication

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
    res
      .status(500)
      .json({ error: "An error occurred while liking the article" });
  }
});

// Route to handle liking an article
router.post("/article/save/:id", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have implemented user authentication

    // Check if the user and article exist
    // const user = await User.findById(userId);
    const article = await Article.findById(req.params.id);

    if (!user || !article) {
      return res.status(404).json({ error: "User or article not found" });
    }

    // Add the article's ID to the user's liked articles array
    user.SaveArticals.push(article._id);
    await user.save();

    res.redirect(`/articles/${article._id}`);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while liking the article" });
  }
});

// -----------------Author-------------------

/* GET Auther page. */
router.get("/authorProfile", isLoggedIn, authorprofilepage);

/* GET Write Artical page for Author. */
router.get("/write-article", isLoggedIn, isAuthor, authorwritearticleget);

/* Post Write Artical page for Author. */
router.post("/write-article", imageupload,isAuthor, authorwritearticlepost);

/* GET find Artical page for Author.to find articles */
router.get("/find-article", isLoggedIn, authorfindarticleget);

/* GET edite Artical page for Author*/
router.get("/edit-article/:id",isLoggedIn,isAuthor,authoreditarticle);

/* Post edite Artical page for Author. */
router.post("/edit-article/:id",isLoggedIn,isAuthor, authoreditarticlepost);

/*  delete Artical page for Author. */
router.get("/delete-article/:id",isLoggedIn,isAuthor, authordeletarticle);

// -----------------Admin--------------------

/* GET Admin page. */
router.get("/adminProfile", isLoggedIn,adminprofilepage);

/*  Get find users pages */
router.get("/find-users", isLoggedIn, isAdmin, adminfinduser);

// GET Admin delet-user 
router.get("/delete-user/:id",isLoggedIn,isAdmin, admindeletuser);

// /* Get route for make Author */
// router.get("/make-author/:id",isLoggedIn,isAdmin, async function (req, res, next) {
//   const userid = req.params.id ;
//   const user = await User.findOne({id:userid})
//   if(!user){
//     return res.json({ error: 'User not found' });
//   }

//   user.isAuthor = true;

//   await user.save();

//   res.redirect("/find-users");
// });

/*  Get Admin find Author pages */
router.get("/find-Authors",isLoggedIn,isAdmin, adminfindauthor);

/* POST Admin Terminate-Author. */
router.get("/terminate-Author/:id", adminterminateauthor);

// GET Admin feed-author page.
router.get("/feed-author",isLoggedIn,isAdmin, adminfeedauthor);

/* GET Admin convert the user to Author */
router.get("/make-author/:id",isLoggedIn,isAdmin, adminmakeauthor);

// GET Admin Delet-author. 
router.get("/author-delete/:id",isLoggedIn,isAdmin,admindeleauthor);

/*  Get Article reach page. */
router.get("/Article-reach",isLoggedIn,isAdmin,adminarticlereach);

// --------------Middleware--------------

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin");
  }
}

function isAuthor(req, res, next) {
  if (req.isAuthenticated() && req.user.isAuthor === true) {
    next();
  } else {
    res.send("Not Authenticated person ");
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin === true) {
    next();
  } else {
    res.send("Not Authenticated person ");
  }
}

module.exports = router;
