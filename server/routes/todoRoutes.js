const express = require('express');
const router = express.Router();
const { ValidateToken } = require('../middlewares/Authentication');
const { ValidateTodoRequestBody } = require('../middlewares/RequestBodyValidator');
const { AddTask } = require('../controllers/todoController');

router.route('/add').post(ValidateToken, ValidateTodoRequestBody, AddTask);

module.exports = router;