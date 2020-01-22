/* eslint-disable no-undef */
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);
chai.should();

describe('GET /', () => {
  it('Should return status code 200 and message', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Welcome to AnnouneIT!');
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .get('/someinvalidroute')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(err).to.equal(null);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .post('/someinvalidroute')
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(err).to.equal(null);
        done();
      });
  });
});

describe('User sign up', () => {
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'mugabo@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User created successfully');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstname');
        expect(res.body.data).to.have.property('lastname');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('phone');
        expect(res.body.data).to.have.property('address');
        expect(res.body.data).to.have.property('isAdmin');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data).to.have.property('registered');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'mugabo@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('User already registered. Please use a different email or reset your password');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastname: 'Mugabo',
        email: 'mugabo@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'mugabo@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'hellothere',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Please make sure your passwords are matching');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Mugabo',
        lastname: 'John',
        email: '',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabo',
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
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Mugabo',
        lastname: 'John',
        email: 'mugabo@gmail',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabo',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('email must be a valid email');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'M',
        lastname: 'John',
        email: 'mugabo@gmail',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabo',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('firstname length must be at least 3 characters long');
        done();
      });
  });
});

describe('User sign in', () => {
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'hello@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User created successfully');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstname');
        expect(res.body.data).to.have.property('lastname');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('phone');
        expect(res.body.data).to.have.property('address');
        expect(res.body.data).to.have.property('isAdmin');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data).to.have.property('registered');
        done();
      });
  });
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
