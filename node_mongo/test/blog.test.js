const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const request= require('supertest');
const app = require('../backend/server');


chai.use(chaiHttp);
const expect = chai.expect;
const should = require('chai').should() //actually call the function

 describe('Blog API', async function ()  {
//   this.timeout(10000)
//    it('Should return a list of all blogs',async function ()  {
//        const res =  await request(app)
//        .get('/api/blogs')
//        .expect(200);
//        const { body } = res;
//        body.should.be.an('array')
//        body.length.should.be.above(0);
//    });

  // In this test it's expected a list of all blogs
      describe('GET /blogs', function() {
        this.timeout(30000)
        it('returns a list of blogs', function(done) {
            request(app).get('/api/blogs')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.should.be.an('array'))
                   // expect(res.body).length.should.be.above(0);
                    done(err);
                });
        });
    });

      // In this test it's expected a blog with specified ID
      describe('GET specific /blogs/:id', function() {
        this.timeout(30000)
        it('returns a specific blog by ID', function(done) {
         // var task = request(app).get('/api/blogs')[0];
//console.log(task);
           request(app).get('/api/blogs/63e379e831b6ecc8923445a7')
               
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.should.be.an('object'))
                    expect(res.body.should.have.property('title'));
                    expect(res.body.should.have.property('content'));
                    done(err);
                });
        });
    });

      // In this test it's expected to create a new blog
      describe('Create new /blog', function() {
        this.timeout(30000)
        it('Creates a new blog', function(done) {
       const newBlog = {
       title: 'Test Blogs2345',
       content: 'This is a test blog.',
       
      // image: '/uploads/  req.file.filename', // placeholder for now
      // category: "req.body.category",
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
    });

      //  ---Updates an existing blog----
    describe('Updates an existing /blog', function() {
      this.timeout(30000)
      it('Updates an existing /blog', function(done) {
     const updatedBlog = {
     title: 'Updated Test Blogs234',
     content: 'This is a test blog.',
   };
          request(app).put('/api/blogs/63e379e831b6ecc8923445a7')
              .expect(403)
              .send(updatedBlog)
              .end(function(err, res) {
                  expect(res.body.should.be.an('object'))
                  //expect(res.body.should.have.property('title'));
                  //expect(res.body.should.have.property('content'));
                  done(err);
              });
      });
  });



  }) 

//        it('Should update an existing blog', function () {
//      const updatedBlog = {
//        title: 'Updated Blog',
//        content: 'This is an updated test blog.'
//      };

//      const res = request(app)
//      .put('/api/blogs/63e379e831b6ecc8923445a7')
//        .send(updatedBlog)
//        .expect(403)
//        .expect((res) => {
//          const blog = res.body;
//          blog.should.be.an('object');
//          blog.should.have.property('title', updatedBlog.title);
//          blog.should.have.property('content', updatedBlog.content);
//        })
//    });


  

// //   it('Should delete a blog', async function () {
// //     const res = await request(app)
// //       .delete('/api/blogs/63e24f6e0a5362b77b7dcff7')
// //       .expect(403)
// //   });
// // });