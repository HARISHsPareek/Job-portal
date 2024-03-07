import express from 'express';
import { registerUser } from '../controllers/auth-controller.js';
import { loginController } from '../controllers/auth-controller.js';
import { rateLimit } from 'express-rate-limit'


// IP limiter for security purpose
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	
})

// create router

const router =express.Router();

// routes
// register route
router.post('/register',limiter,registerUser )

// login route
router.post('/login',limiter, loginController)

//  router.post('/test',userAuth,test)

export default router;