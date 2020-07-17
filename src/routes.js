const express = require('express')

const authMiddlewre = require('./middlewares/auth')

const SessionController = require('./controllers/SessionController')


const routes = express.Router()

routes.post('/sessions', SessionController.store)
routes.use(authMiddlewre)
routes.get('/dashboard', (request, response) => {
  response.status(200)

  return response.send()
})


module.exports = routes