const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const HttpRequestError = require('../utils/error');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET } = process.env;
const prisma = new PrismaClient();

class User {
    static async create({ fullName, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword
            }
        });
    }

    static async findByEmail(email) {
        const data = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return data;
    }

    static async login({ email, password }) {
        const user = await this.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpRequestError('Invalid email or password', 401);
        }

        const userPayload = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            passwordResetTokenExpirationDate: user.passwordResetTokenExpirationDate
        };

        const accessToken = jwt.sign(userPayload, JWT_SECRET);

        return {
            ...userPayload,
            accessToken
        };
    }

    static async generatePasswordResetToken({ email }) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetTokenExpirationDate = new Date(Date.now() + 10 * 60 * 1000); // The token expires after 10 minutes

        await prisma.user.update({
            where: {
                email
            },
            data: {
                passwordResetToken: hashedResetToken,
                passwordResetTokenExpirationDate
            }
        });

        return resetToken;
    }

    static async resetPassword({ token, password }) {
        const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedResetToken,
                passwordResetTokenExpirationDate: {
                    gte: new Date(Date.now()),
                }
            }
        });

        if (!user) {
            throw new HttpRequestError('Invalid token!', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword,
                passwordResetTokenExpirationDate: new Date(Date.now())
            }
        });
    }
}

module.exports = User;