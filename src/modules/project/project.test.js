import chai from 'chai';
import chaiHttp from 'chai-http';
import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status';
import server from '../../server';
import {
  newProject,
  fakeProject,
} from '../../utils/fixtures/project.fixture';
import {
  loggedInToken,
  notManagerToken,
} from '../../utils/fixtures/user.fixture';

chai.should();
chai.use(chaiHttp);

describe('/POST project', async () => {
  it('users should be able to send a project proposal', (done) => {
    chai
      .request(server)
      .post('/api/v1/project')
      .set('Authorization', `Bearer ${notManagerToken}`)
      .send(newProject)
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
  it('users should not be able to send a project proposal with wrong body', (done) => {
    chai
      .request(server)
      .post('/api/v1/project')
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(fakeProject)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(BAD_REQUEST);
        res.body.should.have.property('message');
      });
    done();
  });
  it('users should not be able to send a project proposal without logging in', (done) => {
    chai
      .request(server)
      .post('/api/v1/project')
      .send(newProject)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(FORBIDDEN);
        res.body.should.have.property('message');
      });
    done();
  });
});
