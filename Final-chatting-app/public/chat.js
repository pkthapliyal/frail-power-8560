const socket = io("http://localhost:3000", { transports: ["websocket"] })
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let username = urlParams.get("username")
let roomname = urlParams.get("roomname")
//  div and container ;
const message = document.getElementById("message");
const send = document.getElementById("send");
const sendBtn = document.getElementById("sendBtn");

const roomMessage = document.getElementById("messageContainer");
const users = document.querySelector(".users");
const leave = document.getElementById('leave');


let msgBox = document.getElementById('recieveBox')
//  Joining new user 
socket.emit("join", {
    username: username, userroom: roomname
})
//   append message
socket.on("message", (message) => {
    // let p = document.createElement('p')
    // p.innerText = message;
    // roomMessage.append(p)

    let div = document.createElement("div")
    div.setAttribute("class", "receiver-msg msg-btn")
    div.setAttribute("id", 'senderBox')
    let p = document.createElement('p')
    p.innerText = message;
    let br = document.createElement("br")
    div.append(p)
    msgBox.append(div, br)

})
//  get all user of same room 
socket.on("roomUsers", (data) => {
    document.getElementById('room').innerText = data.room;
    users.innerHTML = ""
    data.allUsers.forEach((user) => {
        let li = document.createElement("li")
        li.innerText = user.username
        users.append(li)
    });
})
//  chat message
sendBtn.addEventListener("click", () => {
    socket.emit("chatMessage", { message: message.value })
})
send.addEventListener("click", () => {
    socket.emit("chatMessage", { message: message.value })
})
// leave room
leave.addEventListener("click", () => {
    const warning = confirm("Are your sure yoy want to leave !")
    if (warning) {
        window.location = "./index.html"
    }

})