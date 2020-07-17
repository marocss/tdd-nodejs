const jwt = require('jsonwebtoken')
const { promisify } = require('util')

module.exports = async (request, response, next) => {
  const authHeader = request.headers.authorization

  if(!authHeader) {
    response.status(401)

    return response.json({
      message: 'Token not provided.'
    })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET)

    request.userId = decoded.id

    return next()
  } catch (error) {
    response.status(401)

    return response.json({
      message: 'Invalid token.'
    })
  }
}