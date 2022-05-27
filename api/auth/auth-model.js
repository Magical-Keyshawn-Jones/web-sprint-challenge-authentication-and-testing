const db = require('../../data/dbConfig')

function findBy(user) {
    return db('users').where('username', user.username)
}

function findById(id) {
    return db('users').where('id', id)
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    findBy,
    add,
    findById,
}