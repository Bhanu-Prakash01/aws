const express=require('express');
const server=express();
const mongoose=require('mongoose')
const helmet=require('helmet')
require('dotenv').config();
const cors=require('cors')

//importing files
//tournaments
const all_tournaments=require('./routes/tournaments/tournaments')
const players=require('./routes/tournaments/players')


//middlewares
server.use(express.json())
server.use(helmet());
server.use(cors())

mongoose.connect("mongodb+srv://myfirstbackend:D0TrlgRH2yIfYcF6@cluster0.iuv7w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
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


server.listen(process.env.PORT || 8000,()=>{
    console.log('server is running')
})
