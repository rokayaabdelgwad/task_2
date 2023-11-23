// /services/userService.js

const User = require('../models/userModel');

async function registerUser(username, password) {
  // Assuming you have password hashing logic (e.g., using bcrypt)
  const hashedPassword = await hashPassword(password);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  return newUser;
}

async function hashPassword(password) {
  // Implement password hashing logic here (e.g., using bcrypt)
  // Return the hashed password
}

module.exports = { registerUser, hashPassword };
