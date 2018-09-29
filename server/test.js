import app from './app'
const request = require('supertest')
const assert = require('assert')
const should = require('should')

describe('GET loginRoute', () => {
  it('should fail with incorrect credentials', done => {
    request(app)
      .post('/login')
      .send({ username: 'super', password: 'notCorrect' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(incorrectUsername)
      .end(done)
  })
})

function incorrectUsername(res) {
  res.should.have.property('body')
  res.body.should.have.value('status', 'Incorrect username or password')
}

describe('GET user list', () => {
  it('should return list of users', done => {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(validUserArray)
      .end(done)
  })
})

function validUserArray(res) {
  const body = res.body
  body.should.be.Array()
  body.should.containDeep([{ username: 'super' }])
}

describe('GET group list', () => {
  it('should return list of groups', done => {
    request(app)
      .get('/group')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(validGroupArray)
      .end(done)
  })
})

function validGroupArray(res) {
  const body = res.body
  body.should.be.Array()
}

describe('Create User', () => {
  it('should fail when properties are missing', done => {
    // Arrange
    const brokenUser = {
      username: 'somethiasdhfashdflkh',
      email: null
    }

    request(app)
      .post('/user')
      .send(brokenUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(failureStatus)
      .end(done)
  })

  it('should fail when the user is not unique', done => {
    const userNotUnique = {
      username: 'super',
      email: 'something@email.com',
      rank: null,
      password: 'something'
    }

    request(app)
      .post('/user')
      .send(userNotUnique)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(notUnique)
      .end(done)
  })
})

describe('Create Group', () => {
  const groupsMissingProperties = [
    { name: 'something', description: null },
    { name: null, description: 'something' },
    { name: null, description: null }
  ]
  for (const group of groupsMissingProperties) {
    it('should fail when properties are missing', done => {
      request(app)
        .post('/group')
        .send(group)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(failureStatus)
        .end(done)
    })
  }
})

function failureStatus(res) {
  const body = res.body
  body.should.have.value('status', 'Something went wrong')
}

function notUnique(res) {
  const body = res.body
  body.should.have.value('status', 'not-unique')
}
