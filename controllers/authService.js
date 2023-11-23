const User = require('../models/userModel');

exports.setUserOnlineStatus = async (userId, online) => {
  await User.findByIdAndUpdate(userId, { online });
};