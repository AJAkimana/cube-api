/* import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { subscriptionId } from '../../utils/fixtures/user.fixture';
import { dummySubscriptionId } from '../../utils/fixtures/service.fixture';
import { subscription } from '../../utils/fixtures/subscription.fixture';

chai.should();
chai.use(chaiHttp);

describe('/POST create a subscription', () => {
  it('Should create a subscription', (done) => {
    chai
      .request(app)
      .post(`/api/v1/user/subscription/${subscriptionId}`)
      .send({ ...subscription, serviceId: dummySubscriptionId })
      .end((err, res) => {
        console.log(res.body);
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.be.eql(201);
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
      .request(app)
      .post(`/api/v1/user/subscription/${subscriptionId}`)
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
      .request(app)
      .post(`/api/v1/user/subscription/${dummySubscriptionId}`)
      .send({ ...subscription, serviceId: dummySubscriptionId })
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.status.should.be.eql(404);
        res.body.should.have.property('message');
        done();
      });
  });
}); */
