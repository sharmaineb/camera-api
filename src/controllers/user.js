const Purchase = require('../models/purchase');
const Film = require('../models/film');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register new user
exports.register = (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if user already exists
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else if (user) {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      // Create new user
      const newUser = new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 10) // Hash the password
      });
      
      // Save the user to the database
      newUser.save((err, user) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token
          res.status(201).json({ token: token, user: { username: user.username, email: user.email } });
        }
      });
    }
  });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else if (!user) {
      res.status(401).json({ error: 'Incorrect email or password' });
    } else {
      // Compare the password
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Incorrect email or password' });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token
        res.status(200).json({ token: token, user: { username: user.username, email: user.email } });
      }
    }
  });
};