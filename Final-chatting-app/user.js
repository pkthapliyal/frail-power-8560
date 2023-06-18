let users = []

function userJoin(username, userroom, id) {
    let user = { username, userroom, id }
    users.push(user)
    return user
}

function allUsers(userroom) {
    return users.filter((user) => user.userroom == userroom)
}

function getUser(id) {
    return users.find(user => user.id == id)
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}


module.exports = { userJoin, users, allUsers, getUser, userLeave }