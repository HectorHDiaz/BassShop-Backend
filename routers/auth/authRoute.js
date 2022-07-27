const express = require('express');
const passport = require('../../middlewares/passport');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'views/media') },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
  }
});

const upload = multer({ storage });
const authRouter = express.Router();

authRouter.post('/register',
  upload.single('image'),
  (passport.authenticate("register", {
    failureRedirect: "/register-error",
    successRedirect: "/"
  })));

authRouter.post('/login',
  (passport.authenticate("login", {
    failureRedirect: "/login-error",
    successRedirect: "/"
  })));

module.exports = authRouter;