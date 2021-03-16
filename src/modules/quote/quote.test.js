import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  UNAUTHORIZED,
} from 'http-status';
import app from '../../app';
import {
  loggedInToken,
  notManagerToken,
} from '../../utils/fixtures/user.fixture';
import { projectId } from '../../utils/fixtures/project.fixture';

chai.should();
chai.use(chaiHttp);

describe('/POST manager creates a quote', () => {
  const quote = {
    projectId,
    amount: 5000,
  };
  const fakeQuote = {
    projectId: '603e79c5d78c16174e149647',
  };
  it('Should create a quote', (done) => {
    chai
      .request(app)
      .post('/api/v1/quote')
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(quote)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(CREATED);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Quote has been created successfully',
        );
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
      });
    done();
  });

  it('Should check if authorization has been set', (done) => {
    chai
      .request(app)
      .post('/api/v1/quote')
      .send(quote)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(FORBIDDEN);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'You can not proceed without setting authorization token',
        );
        done();
      });
  });

  it('Should check if a token is valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/quote')
      .set('Authorization', 'Bearer')
      .send(quote)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(UNAUTHORIZED);
        res.body.should.have.property('message');
        res.body.message.should.equal('Unauthorized, invalid token');
        done();
      });
  });
  it('Should check if a user is a manager', (done) => {
    chai
      .request(app)
      .post('/api/v1/quote')
      .set('Authorization', `Bearer ${notManagerToken}`)
      .send(quote)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(UNAUTHORIZED);
        res.body.should.have.property('message');
        res.body.message.should.be.equal(
          'Only a manager can create a quote',
        );
      });
    done();
  });
  it('Should create a quote', (done) => {
    chai
      .request(app)
      .post('/api/v1/quote')
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(fakeQuote)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(BAD_REQUEST);
        res.body.should.have.property('message');
      });
    done();
  });
});
