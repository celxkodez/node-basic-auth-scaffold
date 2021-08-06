const connection = require('./knexfile')[process.env.NODE_ENV || 'development'];
const database = require('knex')(connection)

export default {
     all: async () => {
        return await database('users')
    },
}