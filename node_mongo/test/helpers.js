const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const request= require('supertest');
const app = require('../backend/server');


chai.use(chaiHttp);
const expect = chai.expect;
const should = require('chai').should() //actually call the function
