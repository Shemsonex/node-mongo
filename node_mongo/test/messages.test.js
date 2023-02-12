import { assert } from 'chai'
import chai from 'chai'
import chaiHttp from 'chai-http'
import request from 'supertest'
import app from '../backend/server.js'


chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should() 

describe('Messages API', async function ()  {
      describe('GET /messages', function() {
        this.timeout(30000)
        
        it('returns a list of all messages', function(done) {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU5NDk0MzR9.14mgvK87afz6VluqsWfDrusy6PfCQLTuLGkrsYzP0e8'
            request(app).get('/api/messages')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.should.be.an('array'))
                   
                    done(err);
                });
        });
        it('returns an error if not token is invalid', function(done) {
            const token = 'eyJhbGciOiJ[IUzI1NiIsInR5cCI6IkpXVCJ9..14mgvK87afz6VluqsWfDrusy6PfCQLTuLGkrsYzP0e8jk'
            request(app).get('/api/messages')
                .set('Authorization', `Bearer ${token}`)
                .expect(400)
                .end(function(err, res) {                   
                    done(err);
                });
        });
        it('returns an error if user is not logged admin', function(done) { 
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzZDM3Yjg2NDBkNTE4YmI5ZGU5ZDUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTk3NzA4N30.OOR37C6X1iRGBZvRLBv3bzkeGCedtD3YqmJH5nMIaGw'
            request(app).get('/api/messages')
                .set('Authorization', `Bearer ${token}`)
                .expect(403)
                .end(function(err, res) {     
                    done(err);
                });
        });
      })
     // In this test it's expected to return a message with specified ID
     describe('GET specific /messages/:id', function() {
        this.timeout(30000)
        it('returns a specific message by ID', function(done) {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU5NDk0MzR9.14mgvK87afz6VluqsWfDrusy6PfCQLTuLGkrsYzP0e8'
           request(app).get('/api/messages/63e25c902de1abb2b802be17')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.should.be.an('object'))
                    expect(res.body.should.have.property('names'));
                    expect(res.body.should.have.property('email'));
                    expect(res.body.should.have.property('content'));
                    done(err);
                });
        });
          it('does not return a message if not admin', function(done) {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzZDM3Yjg2NDBkNTE4YmI5ZGU5ZDUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTk3NzA4N30.OOR37C6X1iRGBZvRLBv3bzkeGCedtD3YqmJH5nMIaGw'
           request(app).get('/api/messages/63e25c902de1abb2b802be17')
                .set('Authorization', `Bearer ${token}`)
                .expect(403)
                .end(function(err, res) {
                    done(err);
                });
        });
    });    

    // In this test it's expected to send a new message
    describe('Create new /message', function() {
        this.timeout(30000)
        it('Sends a new message', function(done) {
       const newMessage = {
       names: 'ishimwe',
       email: 'ishimwettt@gmail.com',
       content: 'New message'
     };
            request(app).post('/api/messages')
                .expect(201)
                .send(newMessage)
                .end(function(err, res) {
                    expect(res.body.should.be.an('object'))
                    expect(res.body.should.have.property('names'));
                    expect(res.body.should.have.property('email'));
                    expect(res.body.should.have.property('content'));
                    done(err);
                });
        });
        it('returns error upon validation error', function(done) {
            const newMessage = {
            names: 'ishimwe',
            email: 'invalid email',
            content: 'New message'
          };
                 request(app).post('/api/messages')
                     .expect(400)
                     .end(function(err, res) {
                         done(err);
                     });
             });
    });

          //  ---Updates an existing message----
          describe('Updates an existing /message', function() {
            this.timeout(30000)
            it('Updates an existing /message', function(done) {
           const updatedBlog = {
           names: 'ishimwe',
           email: 'zzzzzzdddjujjd@gmail.com',
           content: 'a new message inbox'
         };   
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU5NDk0MzR9.14mgvK87afz6VluqsWfDrusy6PfCQLTuLGkrsYzP0e8'
                request(app).put('/api/messages/63e25c902de1abb2b802be17')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200)
                    .send(updatedBlog)
                    .end(function(err, res) {
                        expect(res.body.should.be.an('object'))
                        expect(res.body.should.have.property('names'));
                        expect(res.body.should.have.property('email'));
                        expect(res.body.should.have.property('content'));
                        done(err);
                    });
            });
            it('Should not Update /message if not admin', function(done) {
                const updatedBlog = {
                names: 'ishimwe',
                email: 'zzzzzzdddd@gmail.com',
                content: 'a new message inbox'
              };   
                     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzZDM3Yjg2NDBkNTE4YmI5ZGU5ZDUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTk3NzA4N30.OOR37C6X1iRGBZvRLBv3bzkeGCedtD3YqmJH5nMIaGw'
                     request(app).put('/api/messages/63e25c902de1abb2b802be17')
                         .set('Authorization', `Bearer ${token}`)
                         .expect(401)
                         .end(function(err, res) {
                             expect(res.body.should.be.an('object'))
                         });
                 });
                 it('Should not Update /message if it is not found', function(done) {
                    const updatedBlog = {
                    names: 'ishimwe',
                    email: 'zzzzzzddddjj@gmail.com',
                    content: 'a new message inbox'
                  };   
                         const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU5NDk0MzR9.14mgvK87afz6VluqsWfDrusy6PfCQLTuLGkrsYzP0e8'
                         request(app).put('/api/messages/63e25c902de1abb2b802jhjhbe17')
                             .set('Authorization', `Bearer ${token}`)
                             .expect(404)
                             .end(function(err, res) {
                                 done(err);
                             });
                     });
        });



})