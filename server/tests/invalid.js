/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import messages from '../utils/messages';

const { expect } = chai;
chai.use(chaiHttp);
chai.should();

describe('Invalid routes', () => {
  it('Should return status code 404', (done) => {
    chai.request(app)
      .post('/hello')
      .end((err, res) => {
        const { status, error } = res.body;
        expect(status);
        expect(status).to.equal(404);
        expect(error);
        expect(error).to.equal(messages.invalidRoutes);
        done();
      });
  });
});
