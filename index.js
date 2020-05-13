const express =require('express')
const PORT = process.env.PORT || 5000
const parser = require('body-parser')
const cors = require('cors')
const app = express()
const socketio = require('socket.io')
const http = require('http')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket)=>{
    console.log('we have a new connect from socket')
//this function mangaes the connection that is the socket

//specify what were passing in from the frontend
//we can also pass in a callback
socket.on('join', ({name, room}, callback)=>{
console.log('passing from the frontend to the backend through the sockets..name/room',name,room)

})

//inside here we can call socket and pass the argumen 
//from the front end now that they're already connected

socket.on('disconnect', ()=>{
    console.log('user has left!')
})

})


const router = require('./routes/router')

app.use(router)

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}, work it coder`))
//localhost 5000

