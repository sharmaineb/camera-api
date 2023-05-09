// test/auth.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('../server');

const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(app);
const User = require('../models/user');

describe('User', function () {
  before(function () {
    // Create a test user for authentication
    const user = new User({
      username: 'testone',
      password: 'password'
    });
    user.save();
  });

  after(function () {
    // Remove the test user after all tests are done
    User.findOneAndRemove({ username: 'testone' }, function() {});
  });

  it('should not be able to login if they have not registered', function (done) {
    agent.post('/login', { email: 'wrong@example.com', password: 'nope' }).end(function (err, res) {
      res.should.have.status(401);
      done();
    });
  });

  // signup
  it('should be able to signup', function (done) {
    User.findOneAndRemove({ username: 'testone' }, function() {
      agent
        .post('/sign-up')
        .send({ username: 'testone', password: 'password' })
        .end(function (err, res) {
          console.log(res.body);
          res.should.have.status(200);
          agent.should.have.cookie('nToken');
          done();
        });
    });
  });

  // login
  it('should be able to login', function (done) {
    agent
      .post('/login')
      .send({ username: 'testone', password: 'password' })
      .end(function (err, res) {
        res.should.have.status(200);
        agent.should.have.cookie('nToken');
        done();
      });
  });

  // logout
  it('should be able to logout', function (done) {
    agent.get('/logout').end(function (err, res) {
      res.should.have.status(200);
      agent.should.not.have.cookie('nToken');
      done();
    });
  });
});

// Add the route to create a purchase to server.js
app.post('/create-purchase', checkAuth, (req, res) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).send('You must be logged in to create a purchase.');
  }

  // Otherwise, create the purchase
  const purchase = new Purchase({
    buyer: req.user.userId,
    item: req.body.item,
    price: req.body.price
  });

  purchase.save(err => {
    if (err) {
      return res.status(500).send('Error creating purchase.');
    }
    res.status(201).send(purchase);
  });
});

after(function () {
  agent.close();
});
