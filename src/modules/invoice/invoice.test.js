import chai from 'chai';
import chaiHttp from 'chai-http';
import { BAD_REQUEST, CREATED } from 'http-status';
import server from '../../server';
import {
  newInvoice,
  updateInvoice,
} from '../../utils/fixtures/invoice.fixture';

chai.should();
chai.use(chaiHttp);

describe('/POST invoice data', async () => {
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
      });
    done();
  });
  it('users should not be able to generate an invoice with wrong body', (done) => {
    chai
      .request(server)
      .post('/api/v1/invoice')
      .send(updateInvoice)
      .end((error, res) => {
        res.body.status.should.equal(BAD_REQUEST);
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.should.have.property('message');
      });
    done();
  });
});
