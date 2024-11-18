const UserValidation = require('../validations/user');
const User = require('../models/user');
const sendEmail = require('../utils/mailer');

module.exports = {
    create: async (req, res, next) => {
        try {
            await UserValidation.register(req.body);
            await User.create(req.body);

            return res.status(201).json({
                status: 'OK',
                message: 'Welcome! Successfully registered a new account!'
            });
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            UserValidation.login(req.body);
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
    forgotPassword: async (req, res, next) => {
        try {
            await UserValidation.forgotPassword(req.body);
            const resetToken = await User.generateResetPasswordToken(req.body);
            const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-password?token=${resetToken}`;
            
            await sendEmail(
                req.body.email,
                'You have submitted a password change request!',
                `We have received a password change request. Please use the link below to reset you password\n\n${resetUrl}\n\nDo not share this link to anyone!`
            );

            return res.status(200).json({
                status: 'OK',
                message: 'Link to reset password has been sent to your email'
            });
        } catch (err) {
            next(err);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            UserValidation.resetPassword(req.body);
            await User.resetPassword(req.body);

            res.status(200).json({
                status: 'OK',
                message: 'Password successfully changed'
            });
        } catch (err) {
            next(err);
        }
    },
};