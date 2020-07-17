const supertest = require('supertest')

const app = require('../../src/app')
// const { User } = require('../../src/models')
const truncate = require('../utils/truncate')
const factory = require('../factories')

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('Should authenticate with valid credentials', async () => {
    // const user = await User.create({
    //   name: 'Marcos',
    //   email: 'e@e.com',
    //   password: 'hash'
    // })

    const user = await factory.create('User', {
      password: 'hash'
    })

    // console.log(user)
    
    const response = await supertest(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: 'hash'

      })

    expect(response.status).toBe(200)
  })

  it('Should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User')
    
    const response = await supertest(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: 'wrongpassword'

      })

    expect(response.status).toBe(401)
  })

  it('Should recieve a JWT token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'hash'
    })
    
    const response = await supertest(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: 'hash'

      })

    expect(response.body).toHaveProperty("token")
  })

  it('Should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'hash'
    })
    
    const response = await supertest(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateJWT()}`)

    expect(response.status).toBe(200)
  })

  it('Should not be able to access private routes without JWT token', async () => {
    const user = await factory.create('User', {
      password: 'hash'
    })
    
    const response = await supertest(app)
      .get('/dashboard')

    expect(response.status).toBe(401)
  })

  it('Should not be able to access private routes with invalid JWT token', async () => {
    const user = await factory.create('User', {
      password: 'hash'
    })
    
    const invalidToken = 'kkkkkkk'
    const response = await supertest(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${invalidToken}`)


    expect(response.status).toBe(401)
  })
})
