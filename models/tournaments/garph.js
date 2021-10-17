const mongoose=require('mongoose');

const GraphSchema=new mongoose.Schema({
   match_id:{
       type:Number
   },
   users:{
       type:Number
   }
})

module.exports =mongoose.model("Graph",GraphSchema)


