const UserValidation = require('../validations/user');
const User = require('../models/user');
const HttpRequestError = require('../utils/error');

module.exports = {
    create: async (req, res, next) => {
        try {
            await UserValidation.register(req.body);
            const user = await User.create(req.body);

            res.redirect(`/api/login?email=${user.email}`);
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            await UserValidation.login(req.body);
            const data = await User.login(req.body);

            return res.status(200).json({
                status: 'OK',
                message: 'Successfully logged in',
                data
            });
        } catch (err) {
            next(err);
        }
    },
};