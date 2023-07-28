const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwtcode = "niranjanalibraries";
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

router.post(
  "/signup",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "enter valid password").isLength({min:1}),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:false ,errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({success:false , errors: "email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        email: req.body.email,
        password: req.body.password,
        password: secpass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const usertoken = jwt.sign(data, jwtcode);
      res.json({success:true, usertoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({success:false ,error:"an internal error occured"});
    }
  }
);

router.post(
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "enter valid password").isLength({min:1}),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success:false , errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success:false , error: "please enter correct credentials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        return res
          .status(400)
          .json({success:false , error: "plaese enter correct crededentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const usertoken = jwt.sign(data,jwtcode);
      res.json({success:true, usertoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({success:false ,error:"an internal error occured"});
    }
  }
);

module.exports = router;
