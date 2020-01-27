/* eslint-disable no-undef */
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import messages from '../utils/messages';

dotenv.config();

const { expect } = chai;
let token = '';
let anotherUserToken = '';
let announcementId = null;
chai.use(chaiHttp);
chai.should();

describe('Advertiser', () => {
  it('Should return status code 401', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.noToken);
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
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
        email: 'john@gmail.com',
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
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data.status).to.equal('pending');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        expect(res.body.data).to.have.property('createdon');
        done();
      });
  });
  it('Should return status code 400', (done) => {
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
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementExists);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementEmptyTitle);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'none',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementInvalidTitle);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '01-01-2020 12:15',
        enddate: '02-12-2019 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.expiredDates);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', 'Bearer invalidkey')
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '03-29-2020 12:15',
        enddate: '05-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.malformedToken);
        done();
      });
  });
  it('Should return status code 401', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/1')
      .send({
        title: '70% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
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
      .patch('/api/v1/advertiser/announcement/2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: "February 2030 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2030 12:15',
        enddate: '02-25-2030 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementUpdatetd);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '',
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementEmptyDesc);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'none',
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementInvalidDesc);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '01-01-2020 12:15',
        enddate: '02-12-2019 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.expiredDates);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/1')
      .set('Authorization', 'Bearer invalidkey')
      .send({
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '03-29-2020 12:15',
        enddate: '05-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.malformedToken);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .get('/api/v1/advertiser/announcement/100')
      .set('Authorization', `Bearer ${token}`)
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
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '60% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementCreated);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data.status).to.equal('pending');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        expect(res.body.data).to.have.property('createdon');
        announcementId = res.body.data.id;
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .get(`/api/v1/advertiser/announcement/${announcementId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        expect(res.body.data).to.have.property('createdon');
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .get('/api/v1/advertiser/announcements/active')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementDoesntExist);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .get('/api/v1/advertiser/announcements/something')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.invalidAnnouncementStatus);
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '12% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementCreated);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data.status).to.equal('pending');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        expect(res.body.data).to.have.property('createdon');
        done();
      });
  });
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '13% discount on all products',
        description: "January 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementCreated);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data.status).to.equal('pending');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        expect(res.body.data).to.have.property('createdon');
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .get('/api/v1/advertiser/announcements')
      .set('Authorization', `Bearer ${token}`)
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
  it('Should return status code 200', (done) => {
    chai.request(app)
      .get('/api/v1/advertiser/announcements/pending')
      .set('Authorization', `Bearer ${token}`)
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
  it('Should return status code 201', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Jannet',
        lastname: 'Munyana',
        email: 'jannet@gmail.com',
        phone: '+250787770000',
        address: 'Kigali, Rwanda',
        password: 'munyanajannet',
        confirmpassword: 'munyanajannet',
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
        email: 'jannet@gmail.com',
        password: 'munyanajannet',
      })
      .end((err, res) => {
        anotherUserToken = res.body.data.token;
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.successfulLogin);
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .get('/api/v1/advertiser/announcements')
      .set('Authorization', `Bearer ${anotherUserToken}`)
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
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${anotherUserToken}`)
      .send({
        title: 'Extra discount on products',
        description: "March 2020 promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementCreated);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data.status).to.equal('pending');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        expect(res.body.data).to.have.property('createdon');
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/6')
      .set('Authorization', `Bearer ${anotherUserToken}`)
      .send({
        description: "Christmans 2020 Promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2030 12:15',
        enddate: '02-25-2030 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(messages.announcementUpdatetd);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('description');
        expect(res.body.data).to.have.property('startdate');
        expect(res.body.data).to.have.property('enddate');
        expect(res.body.data).to.have.property('status');
        expect(res.body.data).to.have.property('owner');
        expect(res.body.data.owner).to.be.a('number');
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/1')
      .set('Authorization', `Bearer ${anotherUserToken}`)
      .send({
        description: '',
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementEmptyDesc);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .patch('/api/v1/advertiser/announcement/200')
      .set('Authorization', `Bearer ${anotherUserToken}`)
      .send({
        description: "Christmans 2021 Promo. Discount of up to 50% on all our products. Come buy all house items, we've got you covered! Valid only from jan 1st to jan 31st",
        startdate: '02-23-2020 12:15',
        enddate: '02-25-2020 11:59',
      })
      .end((err, res) => {
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal(messages.announcementNotFound);
        done();
      });
  });
});
