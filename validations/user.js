const HttpRequestError = require("../utils/error");
const User = require('../models/user');

module.exports = {
    register: async ({ fullName, email, password }) => {
        if (!fullName || !email || !password) {
            throw new HttpRequestError('Full name, email, and password are required!', 400);
        }

        if (typeof fullName !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string') {
            throw new HttpRequestError('Full name, email, and password must be string type!', 400)
        }

        if (!email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            throw new HttpRequestError('Email must be in valid format!', 400);
        }

        const isExistedEmail = await User.findByEmail(email);
        
        if (isExistedEmail) {
            // Why 200? Some says 409, but I follow the second most upvoted opinion here https://stackoverflow.com/questions/9269040/which-http-response-code-for-this-email-is-already-registered
            throw new HttpRequestError('Email already registered', 200);
        }
    },
};