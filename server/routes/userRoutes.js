const express = require('express');
const router = express.Router();
const {} = require('../middlewares/Authentication');
const { ValidateUserRequestBody } = require('../middlewares/RequestBodyValidator');
const { CreateUser } = require('../controllers/userController');

router.route('/sign-up').post(ValidateUserRequestBody, CreateUser);

module.exports = router;