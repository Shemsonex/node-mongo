import { assert } from 'chai'
import chai from 'chai'
import chaiHttp from 'chai-http'
import request from 'supertest'
import app from '../backend/server.js'


chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should() //actually call the function

describe('Blog API', async function ()  {
      describe('GET /blogs', function() {
        this.timeout(30000)
        
        it('returns a list of blogs', function(done) {
            request(app).get('/api/blogs')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.should.be.an('array'))
                    done(err);
                });
        });
    });

      // In this test it's expected a blog with specified ID
      describe('GET specific /blogs/:id', function() {
        this.timeout(30000)
        it('returns a specific blog by ID', function(done) {
           request(app).get('/api/blogs/63ea34f2b5a17930f15d6a45')
               
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.should.be.an('object'))
                    expect(res.body.should.have.property('title'));
                    expect(res.body.should.have.property('content'));
                    done(err);
                });
        });
        it('does not return any blog if not found', function(done) {
          request(app).get('/api/blogs/1')
              
               .expect(404)
               .end(function(err, res) {
                   done(err);
               });
       });
    });

      // In this test it's expected to create a new blog
      describe('Create new /blog', function() {
        this.timeout(30000)
        it('Creates a new blog', function(done) {
       const newBlog = {
       title: 'Test xzzz',
       content: 'This is a test blog.',
     };
            request(app).post('/api/blogs')
                .expect(201)
                .send(newBlog)
                .end(function(err, res) {
                    expect(res.body.should.be.an('object'))
                    expect(res.body.should.have.property('title'));
                    expect(res.body.should.have.property('content'));
                    done(err);
                });
        });
        it('does not Create a new blog if title and content fields are empty', function(done) {
          const newBlog = {
          title: '',
          content: '',
        };
               request(app).post('/api/blogs')
                   .expect(400)
                   .end(function(err, res) {
                       done(err);
                   });
           });
           it('does not Create a new blog if it already exists', function(done) {
            const newBlog = {
            title: 'Notepad',
            content: 'cool codes',
          };
                 request(app).post('/api/blogs')
                     .expect(403)
                     .end(function(err, res) {
                      expect(res.body).to.have.property('message', "Blog already exists");
                         done(err);
                     });
             });
    });

      //  ---Updates an existing blog----
    describe('Updates an existing /blog', function() {
      this.timeout(30000)
      it('Updates an existing /blog', function(done) {
     const updatedBlog = {
     title: 'Notepad',
     content: 'cool codes ',
   };   
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU5NDk0MzR9.14mgvK87afz6VluqsWfDrusy6PfCQLTuLGkrsYzP0e8'
          request(app).put('/api/blogs/63ea34f2b5a17930f15d6a45')
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .send(updatedBlog)
              .end(function(err, res) {
                  expect(res.body.should.be.an('object'))
                  expect(res.body.should.have.property('title'));
                  expect(res.body.should.have.property('content'));
                  done(err);
              });
      });
      it('Does not Update an existing /blog if not an admin', function(done) {
        const updatedBlog = {
        title: 'Updated Test zzyyt',
        content: 'This is a test blog.',
      };   
             const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzZDM3Yjg2NDBkNTE4YmI5ZGU5ZDUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTk3NzA4N30.OOR37C6X1iRGBZvRLBv3bzkeGCedtD3YqmJH5nMIaGw'
             request(app).put('/api/blogs/63e4d7de026ec6165af47491')
                 .set('Authorization', `Bearer ${token}`)
                 .expect(403)
                 .end(function(err, res) {
                  expect(res.body).to.have.property('error', 'Unauthorised access. You can only update your own blog.');
                     done(err);
                 });
         });
  });
      // --DELETE A BLOG---
   describe('Delete a blog', function () {
     it('Should not delete a blog if not an admin', function (done) {
       const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzZDM3Yjg2NDBkNTE4YmI5ZGU5ZDUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTk3NzA4N30.OOR37C6X1iRGBZvRLBv3bzkeGCedtD3YqmJH5nMIaGw'
       request(app)
         .delete('/api/blogs/63e4cc69964b5530b79b7ce7')
         .set('Authorization', `Bearer ${token}`)
         .expect(403)
         .end((err, res) => {
           if (err) return done(err);
           expect(res.body).to.have.property('error', 'Unauthorised access. Reserved for admins');
           done();
         });
     });

     it('Should not delete blog if blog does not exist', function (done) {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU4NjUyNTl9.TbKN4QM3WEj1ur14frA8ZgUW6xqZ9XbmKzHt9GeGX0w'
      request(app)
        .delete('/api/blogs/q')
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Blog not found');
          done();
        });
    });
    it('Should delete an existing blog', function (done) {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU4NjUyNTl9.TbKN4QM3WEj1ur14frA8ZgUW6xqZ9XbmKzHt9GeGX0w'
      request(app)
        .delete('/api/blogs/63e4fc20ac000149c043f7f5')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('id', '63e4fc20ac000149c043f7f5');
          done();
        });
    });
   })

     // --DELETE ALL BLOGS---
    //  describe('Delete all blogs', function () {
    //   it('Should not delete the blogs if not an admin', function (done) {
    //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzZDM3Yjg2NDBkNTE4YmI5ZGU5ZDUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY3NTk3NzA4N30.OOR37C6X1iRGBZvRLBv3bzkeGCedtD3YqmJH5nMIaGw'
    //     request(app)
    //       .delete('/api/blogs/')
    //       .set('Authorization', `Bearer ${token}`)
    //       .expect(403)
    //       .end((err, res) => {
    //         if (err) return done(err);
    //         expect(res.body).to.have.property('error', 'Unauthorised access. Reserved for admins');
    //         done();
    //       });
    //   });
 
    // //   it('Should not delete blogs if no blog is found', function (done) {
    // //    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU4NjUyNTl9.TbKN4QM3WEj1ur14frA8ZgUW6xqZ9XbmKzHt9GeGX0w'
    // //    request(app)
    // //      .delete('/api/blogs/')
    // //      .set('Authorization', `Bearer ${token}`)
    // //      .expect(204)
    // //      .end((err, res) => {
    // //        if (err) return done(err);
    // //        expect(res.body).to.have.property('message', 'Blog not found');
    // //        done();
    // //      });
    // //  });
    //  it('Should delete all blogs', function (done) {
    //    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzYWM5Njc3MWQ5ZjZlMzZkNjEwMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzU4NjUyNTl9.TbKN4QM3WEj1ur14frA8ZgUW6xqZ9XbmKzHt9GeGX0w'
    //    request(app)
    //      .delete('/api/blogs/')
    //      .set('Authorization', `Bearer ${token}`)
    //      .expect(200)
    //      .end((err, res) => {
    //        if (err) return done(err);
    //        expect(res.body).to.have.property('message', 'All blogs are deleted');
    //        done();
    //      });
    //  });
    // })
  }) 