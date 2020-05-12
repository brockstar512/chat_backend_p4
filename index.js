const express =require('express')
const PORT = process.env.PORT || 5000
const parser = require('body-parser')
const cors = require('cors')
const app = express()
const socketio = require('socket.io')
const http = require('http')

const server = http.createServer(app)
const io = socketio(server)

const router = require('./routes/router')

app.use(router)

server.listen(PORT, ()=> console.log(`Server has started on poer ${PORT}, work it coder`))
//localhost 5000