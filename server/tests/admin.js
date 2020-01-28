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
      .post('/api/v1/auth/signin')
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
      .post('/api/v1/auth/signin')
      .send({
        email: 'jane@gmail.com',
        password: 'mugabojohn',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        token = res.body.data.token;
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
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
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
      .get('/api/v1/admin/announcements')
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
      .get('/api/v1/admin/announcements')
      .set('Authorization', `Bearer ${admintoken}`)
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
        } = res.body.data[0];
        expect(res.body).to.have.property('status');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('data');
        expect(id);
        expect(id).to.be.a('number');
        expect(title);
        expect(description);
        expect(startdate);
        expect(enddate);
        expect(status);
        expect(owner);
        expect(owner).to.be.a('number');
        expect(createdon);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .delete('/api/v1/admin/announcements/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.announcementDeleted);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .delete('/api/v1/admin/announcements/1000')
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
      .post('/api/v1/advertiser/announcement')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '70% discount on all products',
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
  it('Should return status code 200', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/announcements/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        announcementStatus: 'accepted',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.announcementUpdatetd);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/announcements/1000')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        announcementStatus: 'accepted',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(404);
        expect(error);
        expect(error).to.equal(messages.announcementDoesntExist);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/users/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        userStatus: 'another status',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.invalidUserStatus);
        done();
      });
  });
  it('Should return status code 404', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/users/199')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        userStatus: 'active',
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
  it('Should return status code 409', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/users/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        userStatus: 'active',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(409);
        expect(error);
        expect(error).to.equal(messages.userIsActive);
        done();
      });
  });
  it('Should return status code 200', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/users/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        userStatus: 'blacklisted',
      })
      .end((err, res) => {
        const { status, message } = res.body;
        expect(status);
        expect(status).to.equal(200);
        expect(message);
        expect(message).to.equal(messages.userStatusUpdateSuccessful);
        done();
      });
  });
  it('Should return status code 409', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/users/1')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        userStatus: 'blacklisted',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(409);
        expect(error);
        expect(error).to.equal(messages.userIsBlacklisted);
        done();
      });
  });
  it('Should return status code 400', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/users/invalidId')
      .set('Authorization', `Bearer ${admintoken}`)
      .send({
        userStatus: 'blacklisted',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(400);
        expect(error);
        expect(error).to.equal(messages.invalidUserId);
        done();
      });
  });
  it('Should return status code 401', (done) => {
    chai.request(app)
      .patch('/api/v1/admin/users/invalidId')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userStatus: 'blacklisted',
      })
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(401);
        expect(error);
        expect(error).to.equal(messages.noAminRights);
        done();
      });
  });
});
