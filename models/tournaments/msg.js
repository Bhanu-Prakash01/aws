const mongoose=require('mongoose');

const msgschema=new mongoose.Schema({
   userid:{
       type:Number
   },
   money:{
       type:Number
   },
   upi:{
       type:String
   }
})

module.exports =mongoose.model("Msg",msgschema)


