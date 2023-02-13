import { assert } from 'chai'
import chai from 'chai'
import chaiHttp from 'chai-http'
import request from 'supertest'
import app from '../backend/server.js'


chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should() //actually call the function
