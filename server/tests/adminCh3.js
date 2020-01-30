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
chai.use(chaiHttp);
chai.should();

describe('Admin V2', () => {
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
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
        email: 'johnnymu@gmail.com',
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
  it('Should return status code 404', (done) => {
    chai.request(app)
      .get('/api/v2/admin/announcements')
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
        title: '55% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(201);
        expect(message);
        expect(message).to.equal(messages.announcementCreated);
        done();
      });
  });
  it('Should return status code 401', (done) => {
    chai.request(app)
      .get('/api/v2/admin/announcements')
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(401);
        expect(error);
        expect(error).to.equal(messages.noToken);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .get('/api/v2/admin/announcements')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        const {
          id,
          title,
          text,
          start_date,
          end_date,
          status,
          owner,
          createdon,
        } = res.body.data[0];
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('data');
        expect(id);
        expect(id).to.be.a('number');
        expect(title);
        expect(text);
        expect(start_date);
        expect(end_date);
        expect(status);
        expect(owner);
        expect(owner).to.be.a('number');
        expect(createdon);
        done();
      });
  });
});
