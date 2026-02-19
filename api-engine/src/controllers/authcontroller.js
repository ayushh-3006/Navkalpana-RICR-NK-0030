import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const UserRegister = async (req, res, next) => {
  try {
    //accpect and destructer data
    const { fullName, email, mobileNumber, password, gender} =
      req.body;
    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !password ||
      !gender 
      
    ) {
      const error = new Error("All feild is required");
      error.statusCode = 400;
      return next(error);
    }
    console.log({ fullName, email, mobileNumber, password, gender });

    //cheak duplicate user before registation
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email alerdy register");
      error.statusCode = 409;
      return next(error);
    }
    //encrypt,hashing password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //save data database

    const newuser = await User.create({
      fullName,
      email,
      mobileNumber,
      password: hashPassword,
      gender,
      
    });

    //send req to frontend //Seccessfull data✅
    console.log(newuser);

    res.status(201).json({ message: "Registation seccessfull" });
  } catch (error) {
    next(error);
  }
};

// Login--------
export const UserLogin = async (req, res, next) => {
  try {
    //Fetch data fronted
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All feilds reuired");
      error.statusCode = 400;
      return next(error);
    }
    //check is user regi\der or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email already registerd");
      error.statusCode = 401;
      return next(error);
    }
    //verfy the password

    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
      const error = new Error("Email didn't match");
      error.statusCode = 401;
      return next(error);
    }
   

    //send message to frontend
    res.status(200).json({ message: "Login Successfull", data: existingUser });

    //End
  } catch (error) {
    next(error);
  }
};