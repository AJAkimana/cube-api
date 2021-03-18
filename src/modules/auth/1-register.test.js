import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import cleanAllTables from '../../utils/fixtures/database.fixture';
import {
  createUser,
  user,
  subscriptionId,
  userId,
  // updatedUserProfile,
} from '../../utils/fixtures/user.fixture';
import { subscription } from '../../utils/fixtures/subscription.fixture';
import {
  createQuote,
  dummyQuoteId,
} from '../../utils/fixtures/quote.fixture';
import { createProject } from '../../utils/fixtures/project.fixture';

chai.should();
chai.use(chaiHttp);

describe('/POST register', () => {
  before(async () => {
    await cleanAllTables();
    await createUser();
    await createQuote();
    await createProject();
  });
  it('Should register a user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/register')
      .send(user)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(201);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'User account created successfully',
        );
        res.body.should.have.property('data');
        res.body.data.should.have.property('_id');
        res.body.data.should.have.property('fullName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('password');
        res.body.data.should.have.property('phoneNumber');
        res.body.data.should.have.property('role');
        res.body.data.should.have.property('companyName');
        res.body.data.should.have.property('address');
        res.body.data.should.have.property('linkedin');
        res.body.data.should.have.property('twitter');
        res.body.data.should.have.property('instagram');
        res.body.data.should.have.property('facebook');
        res.body.data.should.have.property('createdAt');
        res.body.data.should.have.property('updatedAt');
      });
    done();
  });

  it('Should validate input fields', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/register')
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(400);
        res.body.should.have.property('message');
      });
    done();
  });

  it('Should check if email already exists', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/register')
      .send(user)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(409);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'User with this email already exist',
        );
      });
    done();
  });
  it('users should not be able to update their profile when Id is wrong', (done) => {
    chai
      .request(server)
      .patch('/api/v1/user/edit-profile/1')
      .send(user)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(400);
        res.body.should.have.property('message');
      });
    done();
  });
  it('users should not be able to update their profile when body is wrong', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/user/edit-profile/${userId}`)
      .send(user)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(400);
        res.body.should.have.property('message');
      });
    done();
  });
  it('users should be able to update their profile', (done) => {
    const updateProfile = {
      fullName: user.fullName,
      companyName: user.companyName,
    };
    chai
      .request(server)
      .patch(`/api/v1/user/edit-profile/${userId}`)
      .send(updateProfile)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(200);
        res.body.should.have.property('message');
      });
    done();
  });
  it('Should create a subscription', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/user/subscription/${subscriptionId}`)
      .send({ ...subscription, quoteId: dummyQuoteId })
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.be.eql(200);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Subscription has been created successfully',
        );
        res.body.should.have.property('data');
        done();
      });
  });
  it('Should not create a subscription', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/user/subscription/${subscriptionId}`)
      .send(subscription)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.be.eql(400);
        res.body.should.have.property('message');
        done();
      });
  });
  it('Should not create a subscription', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/user/subscription/${dummyQuoteId}`)
      .send({ ...subscription, quoteId: dummyQuoteId })
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.be.eql(404);
        res.body.should.have.property('message');
        done();
      });
  });
});
