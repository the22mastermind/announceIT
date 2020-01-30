/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import messages from '../utils/messages';

const { expect } = chai;
let token = '';
let announcementId = '';
chai.use(chaiHttp);
chai.should();

describe('Advertiser V2', () => {
  it('Should return status code 401', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(401);
        expect(error);
        expect(error).to.equal(messages.noToken);
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'John',
        lastname: 'Mugabo',
        email: 'john@gmail.com',
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
        email: 'john@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        const { status, message, data } = res.body;
        token = data.token;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.successfulLogin);
        expect(data).to.have.property('token');
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const {
          id,
          title,
          description,
          startdate,
          enddate,
          status,
          owner,
          createdon,
        } = res.body.data;
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementCreated);
        expect(res.body).to.have.property('data');
        expect(id);
        expect(title);
        expect(description);
        expect(startdate);
        expect(enddate);
        expect(status);
        expect(status).to.equal('pending');
        expect(owner);
        expect(owner).to.be.a('number');
        expect(createdon);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.announcementExists);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.announcementEmptyTitle);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'none',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.announcementInvalidTitle);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '01-01-2020 12:15',
        enddate: '02-12-2019 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.expiredDates);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '01-01-2030 12:15',
        enddate: '01-01-2029 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.expiredDates);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', 'Bearer invalidkey')
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '03-29-2020 12:15',
        enddate: '05-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.malformedToken);
        done();
      });
  });
  // Update announcement
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v2/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '90% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        announcementId = res.body.data.id;
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementCreated);
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('Should return status code 401', (done) => {
    chai.request(app)
      .patch(`/api/v2/advertiser/announcement/${announcementId}`)
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
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
      .patch(`/api/v2/advertiser/announcement/${announcementId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: "February 2030 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2030 12:15',
        enddate: '02-25-2030 11:59',
      })
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
        } = res.body.data;
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementUpdatetd);
        expect(res.body).to.have.property('data');
        expect(id);
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
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch(`/api/v2/advertiser/announcement/${announcementId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '',
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.announcementEmptyDesc);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch(`/api/v2/advertiser/announcement/${announcementId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'none',
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.announcementInvalidDesc);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch(`/api/v2/advertiser/announcement/${announcementId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '01-01-2020 12:15',
        enddate: '02-12-2019 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.expiredDates);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch(`/api/v2/advertiser/announcement/${announcementId}`)
      .set('Authorization', 'Bearer invalidkey')
      .send({
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '03-29-2020 12:15',
        enddate: '05-25-2020 11:59',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.malformedToken);
        done();
      });
  });
});
