
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const { token } = require("morgan");
const { promisify } = require('util');
const crypto = require("crypto");



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // expiresIn: '365d', // Set it to expire in 1 year
    expiresIn: null, // Token doesn't expire
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;

  res.cookie("jwt", token, cookieOption);
  // Remove Password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,

  });


  const token = jwt.sign({ id: newUser._id }, "rokaya-the-first-project-to-learn-nodejs", {
    expiresIn: '90d',
  });

  // const token =signToken(newUser._id)

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password ", 404));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password ", 400));
  }

  // 3) If everything is okay, send a token to the client

  const secretKey = 'rokaya-the-first-project-to-learn-nodejs'|| 'fallback-secret-key';

  if (!secretKey) {
    return res.status(500).json({ error: 'JWT secret key is missing' });
  }
  
  const token = jwt.sign({ id: user._id }, secretKey, {
    expiresIn: '90d', // or your desired expiration
  });

  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.protect = async (req, res, next) => {
  let token;

  // 1) Check if the authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) Verify the token
  try {
    const decoded = await promisify(jwt.verify)(token, 'rokaya-the-first-project-to-learn-nodejs' || 'fallback-secret-key');


    // 3) If the token is valid, attach user information to the request
    req.user = decoded;

    // Adjust to handle both req.user._id and req.user.id
    if (!req.user || !(req.user._id || req.user.id)) {
      return next(new AppError('Invalid user ID', 401));
    }

    next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
};
exports.protectR = async (req, res, next) => {
  let token;

  // 1) Check if the authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('Received token:', token);

  // 2) Verify the token
  try {
    const decoded = await promisify(jwt.verify)(token, 'rokaya-the-first-project-to-learn-nodejs' || 'fallback-secret-key');
    console.log('Decoded user information:', decoded);

    // 3) If the token is valid, attach user information to the request
    req.user = decoded;

    // 4) Check token expiration
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return next(new AppError('Token has expired', 401));
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return next(new AppError('Invalid token', 401));
  }
};


// exports.protect = catchAsync(async (req, res, next) => {
//   // 1) getting token an check of it`s there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   // 2)verification token
//   const decode = await promisify(jwt.verify)(token, "rokaya-the-first-project-to-learn-nodejs");

//   // 3) check if user still exists
//   const freshUser = await User.findById(decode.id);
//   if (!freshUser) {
//     return next(
//       new AppError(
//         "the user  belonging to this token  does no longer exsit ",
//         401
//       )
//     );
//   }

//   // 4) check if user change password after the token was isued
//   if (freshUser.changedPasswordAfter(decode.iat)) {
//     return next(
//       new AppError("User recently changed password! Please log in again.", 405)
//     );
//   }
  
//   req.user = freshUser;
//   next();
// });

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     // roles in is array ["admin","lead-guide"] . role="usre" >>>user not have any premission
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError("You do not have permission to perform this action ", 402)
//       );
//     }

//     next();
//   };
// };

