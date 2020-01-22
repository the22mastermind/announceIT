/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);
chai.should();

describe('GET /', () => {
  it('Should return status code 200 and message', () => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Welcome to AnnouneIT!');
      });
  });
});

describe('User sign up - valid', () => {
  it('Should return status code 201', () => {
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
      });
  });
});

describe('User sign up - invalid firstname', () => {
  it('Should return status code 400', () => {
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
      });
  });
});

describe('User sign up - passwords no match', () => {
  it('Should return status code 400', () => {
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
      });
  });
});

describe('User sign up - empty email', () => {
  it('Should return status code 400', () => {
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
      });
  });
});

describe('User sign up - invalid email', () => {
  it('Should return status code 400', () => {
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
      });
  });
});

describe('User sign up - invalid firstname', () => {
  it('Should return status code 400', () => {
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
      });
  });
});
