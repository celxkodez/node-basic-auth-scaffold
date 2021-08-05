const bcrypt = require("bcrypt");
const localstrategy = require('passport-local').Strategy
const { Pool, Client } = require('pg')

const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'my_blog', //Your db Here too
    password: process.env.PGPASSWORD || '1111', //Insert Your Password Here
    port: '5432',
})

module.exports = new localstrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
        loginAttempt()
        async function loginAttempt() {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                var currentAccountsData = JSON.stringify(
                    client.query(
                        'SELECT id, name, email, password FROM users WHERE email=$1',
                        [username],
                        (err, result) => {
                            if (err) return done(err)

                            if (result.rows[0] == null) {
                                return done(null, false)
                            } else {
                                bcrypt.compare(
                                    password,
                                    result.rows[0].password,
                                    (err, check) => {
                                        if (err) {
                                            console.log(`Error while checking password`)
                                            return done()
                                        } else if (check) {
                                            return done(null, [
                                                {
                                                    email: result.rows[0].email,
                                                    username: result.rows[0].name,
                                                },
                                            ])
                                        } else {
                                            return done(null, false)
                                        }
                                    }
                                )
                            }
                        }
                    )
                )
            } catch (error) {
                throw error
            }
        }
    }
);

