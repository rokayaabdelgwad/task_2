const fileService = require('../services/fileService');
const AppError=require('../utils/appError')
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.uploadFile=
async (req, res) => {
    try {
      const userId = req.user.id; 
      const roomId = req.body.roomId;
      const file = req.file;
  
      if (!userId) {
        // Handle the case where the user is not authenticated
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const uploadedFile = await fileService.uploadFile(userId, roomId, file);
      
      // Respond with the uploaded file information
      res.json(uploadedFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

exports.protect = async (req, res, next) => {
  let token;

  // 1) Check if the authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('Received token:', token);

  // 2) Verify the token
  try {
    const decoded = await promisify(jwt.verify)(token, 'rokaya-the-first-project-to-learn-nodejs'|| 'fallback-secret-key');
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
