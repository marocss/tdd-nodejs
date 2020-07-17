const bcrypt = require('bcryptjs')

const { User } = require('../../src/models')
const truncate = require('../utils/truncate')

describe('User', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('Should encrypt user password', async () => {
    const user = await User.create({
      name: 'Marcos',
      email: 'e@e.com',
      password: 'hash'
    })

    // const hashedPassword = await bcryptjs.hash('hash', 8) 

    const comparison = await bcrypt.compare('hash', user.password_hash)

    expect(comparison).toBe(true)
  })
})