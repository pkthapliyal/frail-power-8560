const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer);
const { userJoin, users, allUsers, getUser, userLeave } = require("./user")

io.on("connection", (socket) => {
    // on new Join
    socket.on("join", ({ username, userroom }) => {
        //  calling userJoin function
        let user = userJoin(username, userroom, socket.id) // return an object

        socket.join(user.userroom); //  joining a room 
        socket.emit("message", "Welcome to the chat"); // welcome message
        //  sending message to the same room where the user has joined
        socket.broadcast.to(user.userroom).emit("message", `${user.username} has joined the chat`)
        //  sending the list of all the users of same room 
        io.to(user.userroom).emit("roomUsers", {
            room: user.userroom,
            allUsers: allUsers(user.userroom)
        })
    })

    socket.on("chatMessage", (message) => {
        const user = getUser(socket.id)
        // console.log(user)
        io.to(user.userroom).emit("message", (`${user.username} : ${message.message}`))
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.userroom).emit("message", `${user.username} has left the chat !`)
            io.to(user.userroom).emit("roomUsers", {
                room: user.userroom,
                allUsers: allUsers(user.userroom)
            })
        }
    })

});

httpServer.listen(3000, () => {
    console.log("Server listening ...")
});