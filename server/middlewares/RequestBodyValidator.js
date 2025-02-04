const validator = require('validator');

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

const ValidateTodoRequestBody = (req, res, next) => {};

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
        res.status(400);
        throw new Error(`Invalid fields: ${errorFields.join(', ')}`);
    }

    next();
};

module.exports = {
    ValidateTodoRequestBody,
    ValidateUserRequestBody
};