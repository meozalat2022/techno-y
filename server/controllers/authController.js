const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middleware/asyncHandler");
const userResponse = require("../utils/userResponse");
const { successResponse } = require("../utils/apiResponse");
const MESSAGES = require("../constants/messages");
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const registerUser = asyncHandler(async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
  } = req.body;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    res.status(404);

    throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
     role: role || ROLES.CUSTOMER,
  });

  const token = generateToken(user._id);

  setTokenCookie(res, token);

  return successResponse(
    res,
    userResponse(user),
    MESSAGES.AUTH.REGISTER_SUCCESS
  );


});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (
    user &&
    (await user.matchPassword(password))
  ) {
    const token = generateToken(user._id);

    setTokenCookie(res, token);

    return successResponse(
      res,
      userResponse(user),
      MESSAGES.AUTH.LOGIN_SUCCESS
    );
  }

  res.status(401);

  throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);

});
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return successResponse(
    res,
    null,
    MESSAGES.AUTH.LOGOUT_SUCCESS
  );
};

const getCurrentUser = asyncHandler(async (req, res) => {
  return successResponse(
    res,
    req.user,
    MESSAGES.AUTH.USER_RETRIEVED
  );
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};