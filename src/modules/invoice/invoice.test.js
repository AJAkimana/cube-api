import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  BAD_REQUEST,
  CREATED,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status';
import server from '../../server';
import {
  newInvoice,
  updateInvoice,
} from '../../utils/fixtures/invoice.fixture';
import {
  loggedInToken,
  notManagerToken,
} from '../../utils/fixtures/user.fixture';

chai.should();
chai.use(chaiHttp);
let id;
const dummyId = notManagerToken._id;

describe('/POST & /PATCH invoice', async () => {
  it('users should be able to generate an invoice with correct body', (done) => {
    chai
      .request(server)
      .post('/api/v1/invoice')
      .send(newInvoice)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(CREATED);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Invoice generated successfully, check your email',
        );
        res.body.should.have.property('data');
        id = res.body.data._id;
      });
    done();
  });
  it('users should not be able to generate an invoice with wrong body', (done) => {
    chai
      .request(server)
      .post('/api/v1/invoice')
      .send(updateInvoice)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(BAD_REQUEST);
        res.body.should.have.property('message');
      });
    done();
  });
  it('manager should be able to update an invoice', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/invoice/${id}`)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(updateInvoice)
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(OK);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Invoice has been updated successfully',
        );
        res.body.should.have.property('data');
      });
    done();
  });
  it('client should not update an invoice', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/invoice/${id}`)
      .set('Authorization', `Bearer ${notManagerToken}`)
      .send(updateInvoice)
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(UNAUTHORIZED);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Only a manager can update an invoice',
        );
        res.body.should.have.property('data');
      });
    done();
  });
  it('should not update an INVALID invoice', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/invoice/${dummyId}`)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(updateInvoice)
      .end((error, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(NOT_FOUND);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          `${dummyId} invoice has not been found`,
        );
      });
    done();
  });
});
