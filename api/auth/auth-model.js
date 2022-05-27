const db = require('../../data/dbConfig')

function findBy(user) {
    return db('users').where(user)
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findBy(id)
}

module.exports = {
    findBy,
    add
}