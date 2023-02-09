const { hash } = require('bcrypt');
const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const request= require('supertest');
const connectDB = require('../backend/config/db');
const {authenticate, authenticateUser }= require('../backend/middleware/authenticate')
const app = require('../backend/server');
//const bcrypt = require('bcrypt')

chai.use(chaiHttp);
const expect = chai.expect;
const should = require('chai').should() //actually call the function

// describe('User Signup', function () {
//     it('should hash the password before saving the user', async function (done) {
//       const plainPassword = 'secretpassword';
//       const saltRounds = 10;
  
//       bcrypt.hash(plainPassword, saltRounds, async function (err, hashedPassword) {
//         if (err) return done(err);
//         // Save the user with the hashed password in the database
//         const newUser = {
//             names: 'Test User',
//             email: 'test@gmail.com',
//             username: 'usertest', // placeholder for now
//             password: plainPassword,
//             role: 'user',
//           };
//           const res = await request(app)
//           .post('/api/users')
//             .send(newUser)
//             .expect(201)
//             .expect((res) => {
//               const User = res.body;
//               User.should.be.an('object');
//               User.should.have.property('names', newUser.names);
//               User.should.have.property('email', newUser.email);
//               User.should.have.property('username', newUser.username);
//               User.should.have.property('password', hashedPassword);
//               User.should.have.property('role', newUser.role);
//             })
  
//         // Retrieve the user from the database
//         // ...
  
//         // Compare the plain password with the hashed password stored in the database
//         bcrypt.compare(plainPassword, retrievedUser.password, function (err, result) {
//           if (err) return done(err);
//           expect(result).to.be.true;
//           done();
//         });
//       });
//     });
//   });

 describe('Users API', function ()  {

   it('Should require authorization to fetch all users', async function ()  {
       const res = await request(app)
       .get('/api/users')
       .expect(401);
   });

   it('Should return an error if not authenticated', async function () {
       const res = await request(app)
       .get('/api/users/63d936e7d73b12818bf27b6f')
       .expect(401)
   });

   it('Should create a new User', function()  {
     const newUser = {
       names: 'Test User 3',
       email: 'test3@gmail.com',
       username: 'usertest',  //placeholder for now
       password: "password",
       role: 'user',
     };
     const res = request(app)
     .post('/api/users')
       .send(newUser)
       .timeout(10000)
       .expect(201)
       .expect((res) => {
         const User = res.body;
         
         User.should.be.an('object');
          User.should.have.property('names', newUser.names);
          User.should.have.property('email', newUser.email);
          User.should.have.property('username', newUser.username);
          User.should.have.property('password', newUser.password);
          User.should.have.property('role', newUser.role);
       })
   });

  it('Shouldnt update an existing User if unauthorised', async function () {
     const updatedUser = {
       names: 'ishimwe',
       email: 'ishimwe202555@gmail.com',
       username: 'ishimwenorbert',
       password: 'password',
       role: 'user'
     };

     const res = await request(app)
     .put('/api/users/63e2f97fb64021d34b7546da')
       .send(updatedUser)
       .expect(401)
      //  .expect((res) => {
      //    const User = res.body;
      //    User.should.be.an('object');
      //    User.should.have.property('names', updatedUser.names);
      //    User.should.have.property('email', updatedUser.email);
      //    User.should.have.property('username', updatedUser.username);
      //    User.should.have.property('password', updatedUser.password);
      //    User.should.have.property('role', updatedUser.role);
      //  })
   });

  it('Should not delete a User if unauthorised', async function () {
     const res = await request(app)
       .delete('/api/users/63d936e7d73b12818bf27b6ft')
       .expect(401)
   });
  })

 
