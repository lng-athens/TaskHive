const express = require('express');
const router = express.Router();
const {} = require('../middlewares/Authentication');
const { ValidateUserRequestBody } = require('../middlewares/RequestBodyValidator');
const { CreateUser, LoginUser } = require('../controllers/userController');

router.route('/sign-up').post(ValidateUserRequestBody, CreateUser);

router.route('/sign-in').post(ValidateUserRequestBody, LoginUser);

module.exports = router;