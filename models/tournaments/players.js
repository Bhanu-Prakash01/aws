const mongoose=require('mongoose');

const PlayersSchema=new mongoose.Schema({
    name:{
        type:String
    },
    id:{
        type:Number
    },
    money:{
        type:Number,
        default:0
    },
    number:{
        type: Number
    },
    password:{
        type:String
    },
    matchPlayed:{
        type:Number,
        default:0
    },
    totalkills:{
        type:Number,
        default:0
    },
    notifications:[
        {
            room_id:{
                type:String
            },
            password:{
                type:String
            }
        }
    ],
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports =mongoose.model("Players",PlayersSchema)


