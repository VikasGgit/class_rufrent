const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const DatabaseService = require('../utils/service'); // Correct import path

dotenv.config();

class AuthController {
  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    this.dbService = new DatabaseService(); // Create an instance of DatabaseService
  }

  /**
   * Handles user signup.
   * @param {Object} req - Express request object containing user details.
   * @param {Object} res - Express response object used to send the response.
   * @returns {Promise<void>}
   */
  async signup(req, res) {
    const { user_name, email_id, passwd } = req.body;
  
    if (!user_name || !email_id || !passwd) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Check if the user already exists
      const results = await this.dbService.getRecordsByFields(
        'dy_user',
        '*',
        `email_id = ${db.escape(email_id)}`
      );
  
      if (results && results.length > 0) {
        return res.status(409).json({ message: 'User already exists. Please login.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(passwd, this.saltRounds);
  
      // Insert the new user
      const fieldNames = 'user_name, email_id, passwd';
      const fieldValues = `${db.escape(user_name)}, ${db.escape(email_id)}, ${db.escape(hashedPassword)}`;
      await this.dbService.addNewRecord('dy_user', fieldNames, fieldValues);
  
      res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
      console.error('Error during signup:', err.message);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
  

  /**
   * Handles user login.
   * @param {Object} req - Express request object containing login details.
   * @param {Object} res - Express response object used to send the response.
   * @returns {Promise<void>}
   */
  async login(req, res) {
    const { email_id, password } = req.body;
  
    if (!email_id || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Retrieve the user by email
      const results = await this.dbService.getRecordsByFields(
        'dy_user',
        '*',
        `email_id = ${db.escape(email_id)}`
      );
  
      if (!results || results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      const user = results[0];
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.passwd);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Generate a JWT
      const token = jwt.sign(
        { id: user.id, email: user.email_id },
        this.jwtSecret,
        { expiresIn: this.jwtExpiresIn }
      );
  
      // Fetch user role
      const roleResults = await this.dbService.getRecordsByFields(
        'st_role',
        'role',
        `id = ${db.escape(user.role_id)}`
      );
  
      const role = roleResults && roleResults.length > 0 ? roleResults[0].role : null;
  
      res.status(200).json({
        message: 'Login successful.',
        token,
        id: user.id,
        userName: user.user_name,
        role,
      });
    } catch (err) {
      console.error('Error during login:', err.message);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }




  
  
  async googleLogin(req, res) {
    const { email, displayName, uid, mobile_no, role_id} = req.body;
    console.log('google login', req.body);
    if (!uid || !mobile_no || !role_id ||!email) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }
  
    try {
     
  
      if (!email) {
        return res.status(400).json({ message: 'Invalid Firebase token.' });
      }
  
      // **Check if user exists in the database**
      const email_id=email;
      const existingUser = await this.dbService.getRecordsByFields(
        'dy_user',
        '*',
        `email_id = ${db.escape(email_id)}`
      );
  console.log('existingUser', existingUser);  
      let user;
      if (existingUser && existingUser.length > 0) {
        user = existingUser[0]; // User already exists
      } else {
        // **Insert new user**
        const fieldNames = 'auth0id, user_name, email_id, mobile_no, role_id';
        
        const fieldValues = `${db.escape(uid)}, ${db.escape(displayName)}, ${db.escape(email)}, ${db.escape(mobile_no)}, ${db.escape(role_id)}`;
  
        const insertId = await this.dbService.addNewRecord('dy_user', fieldNames, fieldValues);
  
        // **Fetch newly inserted user**
        const newUser = await this.dbService.getRecordsByFields(
          'dy_user',
          '*',
          `id = ${insertId}`
        );
        user = newUser[0];
      }
  
      // **Generate JWT Token**
      const token = jwt.sign(
        { id: user.id, email: user.email_id },
        'your_jwt_secret', // Use your secret here
        { expiresIn: '1h' } // Set the expiration time of the token
      );
  
      res.status(200).json({
        message: 'Google login successful.',
        token,
        id: user.id,
        userName: user.user_name,
      });
    } catch (err) {
      console.error('Error during Google login:', err.message);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
  
  
}

module.exports = AuthController;
