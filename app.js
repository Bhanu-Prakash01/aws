const express=require('express');
const server=express();
const mongoose=require('mongoose')
const helmet=require('helmet')
require('dotenv').config();
const cors=require('cors')
const compression=require('compression')

//importing files
//tournaments
const all_tournaments=require('./routes/tournaments/tournaments')
const players=require('./routes/tournaments/players')


//middlewares
server.use(express.json())
server.use(helmet());
server.use(cors())
server.use(compression({
    level:9
}))

mongoose.connect('mongodb://18.221.68.213:27017')
    .then(()=>{
        console.log("database is connected")
    })
    .catch((e)=>{
        console.log(`${e}`)
    })

server.get('/',(req,res)=>{
    res.send("server is running 1")
})

server.use(express.static('public'));  
server.use('/images', express.static('images'))


//main routes

//------->Tournament routes

server.use('/tournament',all_tournaments)
server.use('/players',players)


server.listen(process.env.PORT,()=>{
    console.log('server is running')
})
