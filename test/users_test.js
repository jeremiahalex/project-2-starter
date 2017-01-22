/*global describe, it*/
// const expect = require('chai').expect()
const app = require('../app')
const request = require('supertest')
const server = request.agent(app)
require('colors')

// DEFINE TEST USERS
const testUser1 = {
  email: 'a@b.com',
  name: 'Boy',
  password: 'tomato'
}
const testUser2 = {
  email: 'potato',
  name: 'Boy',
  passsword: 'potato'
}
const testUser3 = {
  email: 'b@c.com',
  name: 'Boy',
  password: 'abc'
}
const testUser4 = {
  email: 'b@c.com',
  password: 'abc'
}

// TESTS
describe('USER SIGNUP'.underline, () => {
  it('should redirect to /users/login on post to /users/signup'.bold, (done) => {
    server.post('/users/signup')
      .send(testUser1)
      .expect('Location', '/users/login', done)
  })
  it('should redirect to /users/signup on unsuccessful signup (email already taken)'.bold, (done) => {
    server.post('/users/signup')
      .send(testUser1)
      .expect('Location', '/users/signup', done)
  })
  it('should redirect to /users/signup on unsuccessful signup (email format invalid)'.bold, (done) => {
    server.post('/users/signup')
      .send(testUser2)
      .expect('Location', '/users/signup', done)
  })
  it('should redirect to /users/signup on unsuccessful signup (password below 5 chars)'.bold, (done) => {
    server.post('/users/signup')
      .send(testUser3)
      .expect('Location', '/users/signup', done)
  })
  it('should redirect to /users/signup on unsuccessful signup (no name provided)'.bold, (done) => {
    server.post('/users/signup')
      .send(testUser4)
      .expect('Location', '/users/signup', done)
  })
})

describe('USER LOGOUT'.underline, () => {
  it('should log the user out and redirect to / on get to /users/logout'.bold, (done) => {
    server.get('/users/logout')
      .expect('Location', '/', done)
  })
})

describe('USER LOGIN'.underline, () => {
  it('should redirect to /profile on successful login'.bold, (done) => {
    server.get('/profile')
      .expect(200, done)
  })
})