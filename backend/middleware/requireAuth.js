const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log('Decoded JWT:', decoded); // Debugging: Log decoded token
    
    const { _id } = decoded;
    
    const user = await User.findOne({ _id }).select('_id email');
    console.log('Fetched user:', user);  // Debugging: Log the fetched user

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);  // Log any errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
