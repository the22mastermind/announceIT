/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);
chai.should();

describe('User sign in', () => {
  it('Should return status code 200', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'hello@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Hello, welcome!');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstname');
        expect(res.body.data).to.have.property('lastname');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('phone');
        expect(res.body.data).to.have.property('address');
        expect(res.body.data).to.have.property('isAdmin');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data).to.have.property('registered');
        expect(res.body.data.email).to.equal('hello@gmail.com');
        done();
      });
  });
  it('Should return status code 401', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'hello@gmail.com',
        password: 'mugabooooo',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid username or password. Please try again.');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: '',
        password: 'mugabooooo',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('email is not allowed to be empty');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'hello@gmail.com',
        password: '',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('password is not allowed to be empty');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: '',
        password: '',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('email is not allowed to be empty');
        done();
      });
  });
});
