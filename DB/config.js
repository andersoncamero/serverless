
const USER = encodeURIComponent(process.env.USER_NAME)
const PASSWORD = encodeURIComponent(process.env.PASSWORD)

const URI = `postgres://${USER}:${PASSWORD}@${process.env.HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`

module.exports = {
    staging: {
        url: URI,
        dialect: process.env.DIALECT,
        dialectOptions: {
            ssl: process.env.SSL
        },
    }
}

