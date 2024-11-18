const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const HttpRequestError = require('../utils/error');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const prisma = new PrismaClient();

class UserValidation {
    static async create({ fullName, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const data = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword
            }
        });
        
        return data;
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
}

module.exports = UserValidation;