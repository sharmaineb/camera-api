const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Films', function () {
  // Test the GET /films route
  describe('GET /films', function () {
    it('should return all films', function (done) {
      chai.request(app)
        .get('/films')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  // Test the POST /films route
  describe('POST /films', function () {
    it('should create a new film', function (done) {
      const film = {
        name: 'Kodak Portra 400',
        iso: 400,
        formats: ['35mm', '120'],
        price: 10.99
      };
      chai.request(app)
        .post('/films')
        .send(film)
        .end(function (err, res) {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql('Kodak Portra 400');
          done();
        });
    });
  });

  // Test the GET /films/:id route
  describe('GET /films/:id', function () {
    it('should return a single film', function (done) {
      const film = {
        name: 'Ilford HP5 Plus',
        iso: 400,
        formats: ['35mm', '120'],
        price: 9.99
      };
      chai.request(app)
        .post('/films')
        .send(film)
        .end(function (err, res) {
          const filmId = res.body._id;
          chai.request(app)
            .get(`/films/${filmId}`)
            .end(function (err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name').eql('Ilford HP5 Plus');
              done();
            });
        });
    });
  });

  // Test the PUT /films/:id route
  describe('PUT /films/:id', function () {
    it('should update a film', function (done) {
      const film = {
        name: 'Fuji Pro 400H',
        iso: 400,
        formats: ['35mm', '120'],
        price: 11.99
      };
      chai.request(app)
        .post('/films')
        .send(film)
        .end(function (err, res) {
          const filmId = res.body._id;
          chai.request(app)
            .put(`/films/${filmId}`)
            .send({ price: 12.99 })
            .end(function (err, res) {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('price').eql(12.99);
              done();
            });
        });
    });
  });
// Test the DELETE /films/:id route
describe('DELETE /films/:id', function () {
    it('should delete a film', function (done) {
      const film = {
        name: 'Kodak Tri-X 400',
        iso: 400,
        formats: ['35mm', '120'],
        price: 10.99
      };
      chai.request(app)
        .post('/films')
        .send(film)
        .end(function (err, res) {
          const filmId = res.body._id;
          chai.request(app)
            .delete(`/films/${filmId}`)
            .end(function (err, res) {
              res.should.have.status(204);
              done();
            });
        });
    });
  });
});  
