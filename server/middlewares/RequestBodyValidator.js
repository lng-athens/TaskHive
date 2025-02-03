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

const ValidateUserRequestBody = (req, res, next) => {};

module.exports = {
    ValidateTodoRequestBody,
    ValidateUserRequestBody
};