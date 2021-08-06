const bcrypt = require("bcrypt");

exports.seed = function(knex) {
  return knex('users').del()
    .then(async function () {
      return knex('users').insert([
        {id: 1, email: 'admin@blog.com', name: 'Admin', role: 'admin', password: await bcrypt.hash('password', 5)},
      ]);
    });
};
