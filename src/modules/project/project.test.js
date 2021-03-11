import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status';
import server from '../../server';
import {
  newProject,
  fakeProject,
  updateProject,
  approveProject,
} from '../../utils/fixtures/project.fixture';
import {
  loggedInToken,
  notManagerToken,
} from '../../utils/fixtures/user.fixture';

chai.should();
chai.use(chaiHttp);

let projectId;

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
          'Project proposal has been created successfully',
        );
        res.body.should.have.property('data');
        projectId = req.body.data._id;
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
  it('users should be able to update a project proposal', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/project/${projectId}`)
      .set('Authorization', `Bearer ${notManagerToken}`)
      .send(updateProject)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(OK);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Project proposal has been updated successfully',
        );
        res.body.should.have.property('data');
      });
    done();
  });
  it('users should not update invalid project id', (done) => {
    chai
      .request(server)
      .patch('/api/v1/project/604bbaccd676d96b93c91f48')
      .set('Authorization', `Bearer ${notManagerToken}`)
      .send(updateProject)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(NOT_FOUND);
        res.body.should.have.property('message');
        res.body.message.should.equal('Project has not been found');
      });
    done();
  });
  it('manager should be able to approve a project proposal', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/project/approve-project/${projectId}`)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .send(approveProject)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(OK);
        res.body.should.have.property('message');
        res.body.message.should.equal(
          'Project proposal has been updated successfully',
        );
        res.body.should.have.property('data');
      });
    done();
  });
  it('users should not be able to approve a project proposal', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/project/approve-project/${projectId}`)
      .set('Authorization', `Bearer ${notManagerToken}`)
      .send(approveProject)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status');
        res.body.status.should.equal(UNAUTHORIZED);
        res.body.should.have.property('message');
      });
    done();
  });
});
