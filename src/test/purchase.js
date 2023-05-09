const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Purchases', function () {
  // Test the GET /purchases route
  describe('GET /purchases', function () {
    it('should return all purchases', function (done) {
      chai.request(app)
        .get('/purchases')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  // Test the POST /purchases route
  describe('POST /purchases', function () {
    it('should create a new purchase', function (done) {
      const purchase = {
        product: 'Sony A7III',
        price: 1999.99,
        quantity: 1
      };
      chai.request(app)
        .post('/purchases')
        .send(purchase)
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('product').eql('Sony A7III');
          done();
        });
    });
  });

  // Test the GET /purchases/:id route
  describe('GET /purchases/:id', function () {
    it('should return a single purchase', function (done) {
      const purchase = new Purchase({
        product: 'Canon EOS R5',
        price: 3799.99,
        quantity: 1
      });
      purchase.save(function (err, savedPurchase) {
        chai.request(app)
          .get(`/purchases/${savedPurchase._id}`)
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('product').eql('Canon EOS R5');
            done();
          });
      });
    });
  });

  // Test the PUT /purchases/:id route
  describe('PUT /purchases/:id', function () {
    it('should update a purchase', function (done) {
      const purchase = new Purchase({
        product: 'Nikon Z7 II',
        price: 2999.99,
        quantity: 1
      });
      purchase.save(function (err, savedPurchase) {
        chai.request(app)
          .put(`/purchases/${savedPurchase._id}`)
          .send({ quantity: 2 })
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('quantity').eql(2);
            done();
          });
      });
    });
  });

  // Test the DELETE /purchases/:id route
  describe('DELETE /purchases/:id', function () {
    it('should delete a purchase', function (done) {
      const purchase = new Purchase({
        product: 'Nikon D850',
        price: 3299.99,
        quantity: 1
      });
      purchase.save(function (err, savedPurchase) {
        chai.request(app)
          .delete(`/purchases/${savedPurchase._id}`)
          .end(function (err, res) {
            res.should.have.status(204);
            done();
          });
      });
    });
  });
});
