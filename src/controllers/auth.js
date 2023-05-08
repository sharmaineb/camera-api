const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = app => {
  app.get('/sign-up', (req, res) => res.render('sign-up'));

  // SIGN UP POST
  app.post('/sign-up', async (req, res) => {
    try {
      // Create User and JWT
      const user = new User(req.body);
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res.redirect('/');
    } catch (err) {
      console.log(err.message);
      return res.status(400).send({ err });
    }
  });

  // LOGOUT
  app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
  });

  // LOGIN FORM
  app.get('/login', (req, res) => res.render('login'));

  // LOGIN
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Find this user name
      const user = await User.findOne({ username }, 'username password');
      if (!user) {
        // User not found
        return res.status(401).send({ message: 'Wrong Username or Password' });
      }
      // Check the password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // Password does not match
        return res.status(401).send({ message: 'Wrong Username or password' });
      }
      // Create a token
      const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
        expiresIn: '60 days',
      });
      // Set a cookie and redirect to root
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  });
};
