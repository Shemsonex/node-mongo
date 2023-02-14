import mongoose from "mongoose"
import Joi from "@hapi/joi"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  names: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  username: {
    type: String,
    required: true,
    unique : true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  picture: {
    type: Buffer,
  },
  role: {
    type: String,
    required : true,
  },
});

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hashedPassword) => {
      user.password = hashedPassword;
      next();
    });
  });
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, role: this.role }, 'secretkey');
};

const validateUser = (user) => {
  const schema = Joi.object({
    names: Joi.string().min(3).max(30).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,90}$"))
      .required(),
    email: Joi.string().email().required(),
    role: Joi.string().alphanum().min(3).max(30).required(),
  });

  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);

export { User, validateUser };
