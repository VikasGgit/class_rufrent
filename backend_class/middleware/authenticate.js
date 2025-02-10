const jwt = require('jsonwebtoken');
require('dotenv').config();


const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("../config/firebase_admin.json")),
});

const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer header

  if (!idToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user data to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email  
    };

    console.log("Decoded User:", req.user);
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};




// Middleware to authenticate requests using JWT
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      console.log('Authorization header missing');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid Authorization format');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Optionally attach user info to the request object
        next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('Token expired');
          return res.status(403).json({ error: 'Token expired.' });
        } else if (err.name === 'JsonWebTokenError') {
          console.log('Invalid token');
          return res.status(403).json({ error: 'Invalid token.' });
        } else {
          console.log('Token verification error:', err.message);
          return res.status(403).json({ error: 'Authentication failed.' });
        }
      }
        };
  




      

module.exports = {authenticate, verifyToken};
