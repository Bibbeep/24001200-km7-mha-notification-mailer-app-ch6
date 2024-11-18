const UserValidation = require('../validations/user');
const User = require('../models/user');

module.exports = {
    create: async (req, res, next) => {
        try {
            await UserValidation.register(req.body);
            const user = await User.create(req.body);

            res.status(201).json({
                status: 'OK',
                message: 'Account successfully registered',
                data: user
            });
        } catch (err) {
            next(err);
        }
    },
};