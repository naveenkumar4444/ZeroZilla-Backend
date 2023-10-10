const router = require("express").Router();
const UserModel = require("../models/UserModel");
const CryptoJS = require("crypto-js");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const HttpException = require("../middlewares/HttpException");

router.post("/register", async (request, response, next) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const result = schema.validate(request.body);

    if (result.error) {
      throw new HttpException(false, 400, result.error.details[0].message);
    } else {
      const body = request.body;

      body.password = CryptoJS.AES.encrypt(
        body.password,
        process.env.JWT_SEC_KEY
      );

      const user = await UserModel.create(body);

      const { password, ...newUser } = user["_doc"];

      response.status(201).send({
        status: true,
        message: "Registration successful",
        data: newUser,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const result = schema.validate(request.body);

    if (result.error) {
      throw new HttpException(false, 400, result.error.details[0].message);
    } else {
      const body = request.body;

      const user = await UserModel.findOne({ email: body.email });
      !user &&
        response.status(401).json({
          status: false,
          message: "Wrong Credentials",
        });

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.JWT_SEC_KEY
      ).toString(CryptoJS.enc.Utf8);

      (body.password !== hashedPassword) &&
        response.status(401).json({
          status: false,
          message: "Wrong Credentials",
        });

      const { password, ...newUser } = user["_doc"];

      const authToken = jwt.sign(
        {
          id: newUser._id,          
        },
        process.env.JWT_SEC_KEY,
        {
          expiresIn: "24h",
        }
      );

      response.status(200).send({
        status: true,
        message: "Login success",
        data: { ...newUser, token: authToken },
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
