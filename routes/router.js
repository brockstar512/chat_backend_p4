const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    res.send('server is at a brisk jog')
})


module.exports= router