/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import messages from '../utils/messages';

const { expect } = chai;
chai.use(chaiHttp);
chai.should();

describe('User sign up V2', () => {
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        const {
          id,
          firstname,
          lastname,
          email,
          phone,
          address,
          isadmin,
          status,
          createdon,
        } = res.body.data;
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulSignup);
        expect(res.body).to.have.property('data');
        expect(id);
        expect(firstname);
        expect(lastname);
        expect(email);
        expect(phone);
        expect(address);
        expect(isadmin);
        expect(isadmin).to.be.a('boolean');
        expect(status);
        expect(createdon);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        const { status, error } = res.body;
        expect(res.body).to.have.property('status');
        expect(status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(error).to.equal(messages.userExists);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        lastname: 'Mugabo',
        email: 'mugabo@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(res.body).to.have.property('status');
        expect(status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(error).to.equal(messages.emptyFirstName);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        const { status, error } = res.body;
        expect(res.body).to.have.property('status');
        expect(status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(error).to.equal(messages.passwordsNoMatch);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        const { status, error } = res.body;
        expect(res.body).to.have.property('status');
        expect(status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(error).to.equal(messages.emptyEmail);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        const { status, error } = res.body;
        expect(res.body).to.have.property('status');
        expect(status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(error).to.equal(messages.invalidEmail);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        const { status, error } = res.body;
        expect(res.body).to.have.property('status');
        expect(status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(error).to.equal(messages.invalidFirstName);
        done();
      });
  });
});

describe('User sign in V2', () => {
  it('Should return status code 404', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'hello@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(404);
        expect(error);
        expect(error).to.equal(messages.userDoesntExist);
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        const {
          id,
          firstname,
          lastname,
          email,
          phone,
          address,
          isadmin,
          status,
          createdon,
        } = res.body.data;
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulSignup);
        expect(res.body).to.have.property('data');
        expect(id);
        expect(firstname);
        expect(lastname);
        expect(email);
        expect(phone);
        expect(address);
        expect(isadmin);
        expect(isadmin).to.be.a('boolean');
        expect(status);
        expect(createdon);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'hello@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        const {
          token,
          id,
          firstname,
          lastname,
          email,
          phone,
          address,
          isadmin,
          status,
          createdon,
        } = res.body.data;
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulLogin);
        expect(res.body).to.have.property('data');
        expect(token);
        expect(id);
        expect(firstname);
        expect(lastname);
        expect(email);
        expect(phone);
        expect(address);
        expect(isadmin);
        expect(isadmin).to.be.a('boolean');
        expect(status);
        expect(createdon);
        expect(email).to.equal('hello@gmail.com');
        done();
      });
  });
  it('Should return status code 401', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'hello@gmail.com',
        password: 'mugabooooo',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(401);
        expect(error);
        expect(error).to.equal(messages.invalidCredentials);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: '',
        password: 'mugabooooo',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.emptyEmail);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'hello@gmail.com',
        password: '',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.emptyPassword);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: '',
        password: '',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.emptyEmail);
        done();
      });
  });
});

describe('User reset password in V2', () => {
  it('Should return status code 404', (done) => {
    chai.request(app)
      .post('/api/v2/auth/reset_password')
      .send({
        email: 'wronguser@gmail.com',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(404);
        expect(error);
        expect(error).to.equal(messages.userDoesntExist);
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'bertrand8811@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'bertrand88',
        confirmpassword: 'bertrand88',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(201);
        expect(message);
        expect(message).to.equal(messages.successfulSignup);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'bertrand8811@gmail.com',
        password: 'bertrand88',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.successfulLogin);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/reset_password')
      .send({
        email: 'bertrand8811@gmail.com',
        password: 'mugabooooo',
        new_password: 'mugabooooo',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.passwordsNoMatchExisting);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/auth/reset_password')
      .send({
        email: 'bertrand8811@gmail.com',
        password: 'bertrand88',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.noNewPassword);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .post('/api/v2/auth/reset_password')
      .send({
        email: 'bertrand8811@gmail.com',
        password: 'bertrand88',
        new_password: 'hello123',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.passwordResetSuccessful);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .post('/api/v2/auth/reset_password')
      .send({
        email: 'bertrand8811@gmail.com',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.passwordResetSuccessful);
        done();
      });
  });
});
