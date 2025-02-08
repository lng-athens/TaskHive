const validator = require('validator');
const logger = require('../utils/Logger');

const isUsername = (value) => {
    const regex = /^[A-Za-z0-9][A-Za-z0-9_.]*$/;

    return regex.test(value);
}

const isName = (value) => {
    const regex = /^[A-Za-z]+([ ]?[A-Za-z]+)*$/;

    return regex.test(value);
}

const isValidMonth = (value) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return months.includes(value);
};

const isValidDay = (day, month, year) => {
    if (!validator.isInt(day.toString(), { min: 1, max: 31 })) return false;
    const daysInMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0).getDate();
    
    return day <= daysInMonth;
};

const isValidTask = (value) => {
    const regex = /^[A-Za-z0-9][A-Za-z0-9 ]*$/;
    return regex.test(value);
};

const isValidText = (value) => {
    const regex = /^[A-Za-z0-9!@#\$%\^&\*\(\)\-_\+=\[\]\{\};:'",.<>\/?\\|`~][A-Za-z0-9!@#\$%\^&\*\(\)\-_\+=\[\]\{\};:'",.<>\/?\\|`~ ]*$/;

    return regex.test(value);
};

const isValidDeadline = (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
};

const isValidCategory = (category) => {
    const categories = ['Immediate', 'Urgent', 'High Priority', 'Moderate Priority', 'Low Priority'];
    return categories.includes(category);
};

const ValidateTodoRequestBody = (req, res, next) => {
    const {
        task,
        details,
        category,
        deadline
    } = req.body.taskDetails;

    let errorFields = [];

    if (task && !isValidTask(task)) {errorFields.push('task')}
    if (details && !details.every(isValidText)) {errorFields.push('details')}
    if (category && !isValidCategory(category)) {errorFields.push('category')}
    if (!deadline || !isValidDeadline(deadline)) {errorFields.push('deadline')}

    if (errorFields.length > 0) {
        logger.error(`Invalid fields: ${errorFields.join(', ')}`);
        res.status(400);
        throw new Error(`Invalid fields: ${errorFields.join(', ')}`);
    }

    next();
};

const ValidateUserRequestBody = (req, res, next) => {
    const {
        firstName,
        lastName,
        username,
        email,
        password,
        userId
    } = req.body;

    let errorFields = [];

    if (firstName && !isName(firstName)) {errorFields.push('firstName')}
    if (lastName && !isName(lastName)) {errorFields.push('lastName')}
    if (username && !isUsername(username)) {errorFields.push('username')}
    if (email && !validator.isEmail(email)) {errorFields.push('email')}
    if (password && !validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {errorFields.push('password')}
    if (userId && !(isUsername(userId) || validator.isEmail(userId))) {errorFields.push('userId')}

    if (errorFields.length > 0) {
        logger.error(`Invalid fields: ${errorFields.join(', ')}`);
        res.status(400);
        throw new Error(`Invalid fields: ${errorFields.join(', ')}`);
    }

    next();
};

module.exports = {
    ValidateTodoRequestBody,
    ValidateUserRequestBody
};