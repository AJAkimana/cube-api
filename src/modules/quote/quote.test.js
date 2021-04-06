import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from 'http-status';
import app from '../../app';
import {
  newQuote,
  dummyQuoteId,
} from '../../utils/fixtures/quote.fixture';
import {
  loggedInToken,
  notManagerToken,
} from '../../utils/fixtures/user.fixture';

chai.should();
chai.use(chaiHttp);

describe('/POST manager creates a quote', () => {
  const fakeQuote = {
    projectId: '603e79c5d78c16174e149647',
  };
  const updatePrice = {
    amount: 10000,
  };
  it('Should create a quote', (done) => {
    chai
      .request(app)
      .post('/api/v1/quote')
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(newQuote)
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
      .send(newQuote)
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
      .send(newQuote)
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
      .send(newQuote)
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
  it('Should not create a quote', (done) => {
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
  it('Should update a quote', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/quote/${dummyQuoteId}`)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(updatePrice)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(OK);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Quote has been updated successfully',
        );
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
      });
    done();
  });
  it('Should not update invalid quote', (done) => {
    chai
      .request(app)
      .patch('/api/v1/quote/604bbaccd676d96b93c91f48')
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(updatePrice)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(NOT_FOUND);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
      });
    done();
  });
  it('Should check if a user is a manager', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/quote/${dummyQuoteId}`)
      .set('Authorization', `Bearer ${notManagerToken}`)
      .send(updatePrice)
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
  it('Should check if authorization has been set', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/quote/${dummyQuoteId}`)
      .send(newQuote)
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
      .patch(`/api/v1/quote/${dummyQuoteId}`)
      .set('Authorization', 'Bearer')
      .send(newQuote)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.equal(UNAUTHORIZED);
        res.body.should.have.property('message');
        res.body.message.should.equal('Unauthorized, invalid token');
        done();
      });
  });
});
