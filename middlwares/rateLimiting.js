const { rateLimit } = require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hours
	limit: 5, // Limit each IP to 1requests per `window` (here, per 1 hour)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: true, // Disable the `X-RateLimit-*` headers
	handler:(req,res,next,options)=>{res.status(options.statusCode).json({message:options.message})}//will return if the user hit the limit
})

module.exports = limiter