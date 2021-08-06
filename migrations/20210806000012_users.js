
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments() ;
        table.string('email').unique();
        table.string('name');
        table.string('role').nullable();
        table.string('password');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};
