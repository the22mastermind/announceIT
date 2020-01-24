/* eslint-disable no-undef */
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import messages from '../utils/messages';

dotenv.config();

const { expect } = chai;
let token = '';
let admintoken = '';
chai.use(chaiHttp);
chai.should();

describe('Admin', () => {
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'johnnymu@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
        isadmin: true,
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulSignup);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'johnnymu@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        admintoken = res.body.data.token;
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulLogin);
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('isAdmin');
        expect(res.body.data.isAdmin).to.equal(true);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .get('/api/v1/admin/announcements')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementDoesntExist);
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'jane@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulSignup);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'jane@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        token = res.body.data.token;
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulLogin);
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementCreated);
        done();
      });
  });
  it('Should return status code 401', (done) => {
    chai.request(app)
      .get('/api/v1/admin/announcements')
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.noToken);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .get('/api/v1/admin/announcements')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0].id).to.be.a('number');
        expect(res.body.data[0]).to.have.property('title');
        expect(res.body.data[0]).to.have.property('description');
        expect(res.body.data[0]).to.have.property('startdate');
        expect(res.body.data[0]).to.have.property('enddate');
        expect(res.body.data[0]).to.have.property('status');
        expect(res.body.data[0]).to.have.property('owner');
        expect(res.body.data[0].owner).to.be.a('number');
        expect(res.body.data[0]).to.have.property('createdon');
        done();
      });
  });
});
