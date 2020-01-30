/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import messages from '../utils/messages';

const { expect } = chai;
let token = '';
let admintoken = '';
let advertiserId = '';
let announcementId = '';
chai.use(chaiHttp);
chai.should();

describe('Admin V2', () => {
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'johnnymugabo@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'mugabojohn',
        confirmpassword: 'mugabojohn',
        isadmin: true,
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
        email: 'johnnymugabo@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        admintoken = res.body.data.token;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.successfulLogin);
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('isadmin');
        expect(res.body.data.isadmin).to.equal(true);
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        email: 'jane@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        token = res.body.data.token;
        advertiserId = res.body.data.id;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.successfulLogin);
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '65% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        announcementId = res.body.data.id;
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(201);
        expect(message);
        expect(message).to.equal(messages.announcementCreated);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .delete(`/api/v2/admin/announcements/${announcementId}`)
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        const { status, message, data } = res.body;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.announcementDeleted);
        expect(data);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .delete('/api/v2/admin/announcements/1000')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(404);
        expect(error);
        expect(error).to.equal(messages.announcementDoesntExist);
        done();
      });
  });
});
