const mongooose = require('mongoose');

const usersSchema = new mongooose.Schema({
    name: String,
    email: String,
    password: String,
})

module.exports = mongooose.model('users',usersSchema)