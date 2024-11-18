const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

module.exports = {
    create: async ({ fullName, email, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword
            }
        });

        return data;
    },
    findByEmail: async (email) => {
        const data = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return data;
    },
}