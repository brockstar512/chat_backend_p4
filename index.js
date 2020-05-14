const express =require('express')
const parser = require('body-parser')
const cors = require('cors')
const socketio = require('socket.io')
const http = require('http')
const { addUser, removeUser, getUser, getUsersInRoom} =require('./controllers/usersControllers')

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = socketio(server)


const router = require('./routes/router')

app.use(router)



io.on('connection', (socket)=>{
    console.log('we have a new connect from socket')
    //this function mangaes the connection that is the socket
    //we have a join and a disconnect in the connection

    //specify what were passing in from the frontend
    //we can also pass in a callback
    socket.on('join', ({ name, room }, callback) => {
    // console.log('passing from the frontend to the backend through the sockets..name/room',name,room)

    //THE FOLLOWING IS HOW WE HANDLE INCOMING USERS
        const { error, user } = addUser({ id: socket.id, name, room });
        console.log('this is what user is from addUser', user)
    //we are destructuring an object 
    //error can only have two responses... a new user and an error
    //user needs to be passed two arguments. id user and room
    //id is the socket id. its the id from the front end here...
                                // socket = io(ENDPOINT)
                                // console.log(socket)
                                // // console.log("this is endpoint", ENDPOINT)
                                // // console.log("location.search...",location.search)
                        //this is referencing the error found in the conreoller
                        //its calling that function as a callback
    if(error){ return callback(error)}
    //this is logging message for incoming user
    //this emits a message from the back end to the front end
    socket.join(user.room);
    socket.emit('message', {user:'admin', text:`${user.name}, Welcome to the party ${user.room}`})
    socket.broadcast.to(user.room).emit('message', {user:'admin', text:`${user.name} has joined`})
    //socket.broadcast sends a message tp everyone in the room, except for that user
    socket.join(user.room)
    //this joins the input user into a room

    io.to(user.room).emit('roomData',{room: user.room, users: getUsersInRoom(user.room)})
    //sending data to all users. this is emitting on the key word  roomData
    //the room the user is in and the function that brings in all users in the room with the argument of
    //the users in that specific room
    callback();
    })

    //HERE IS HOW WE HANDLE USER GENERATED MESAGES
    //admin generated message is message
    //user generated messages will be refered to as sendMessage
    //this is going to wait on the front end to emit a message ot the backend
    //** THE ON FUNCTION TAKES IN TWO PARAMETERS> 1. keyword 2. arrow function
    //the function is going to run after something is emitted
    socket.on('sendMessage', (message, callback) =>{
                            //message coming from the front end
        const user = getUser(socket.id)
        //accessing the room the user is in
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users:getUsersInRoom(user.room)});
        
        callback()
    })


    //inside here we can call socket and pass the argumen 
    //from the front end now that they're already connected
    socket.on('disconnect', ()=>{
        console.log('user has left!')
        const user = removeUser(socket.id)

        //below we send a meesage to the socket room that the room was in
        //otherwise when you disconnect it would not remove user from array
        if(user){
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            
        }
    })

})


    server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}, work it coder`))
    //localhost 5000

