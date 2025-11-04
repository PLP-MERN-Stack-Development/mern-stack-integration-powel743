// /server/controllers/userController.js
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';

// /server/controllers/userController.js (Corrected authUser)

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // 1. FIX: Pass 'res' to generateToken to set the secure HTTP-only cookie.
    generateToken(res, user._id); 
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // 2. FIX: The 'token' property is removed as the token is now in the cookie.
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); 
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // 1. FIX: Pass 'res' to generateToken to set the secure HTTP-only cookie.
    generateToken(res, user._id); 
    
    res.status(201).json({ // Created
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // 2. FIX: The 'token' property is removed as the token is now in the cookie.
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { authUser, registerUser };