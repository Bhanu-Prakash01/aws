const express=require('express');
const router=express.Router();
const Tournaments=require('../../models/tournaments/tournaments');
const Players = require('../../models/tournaments/players');
const Graph = require('../../models/tournaments/garph')

router.post('/post', async (req,res)=>{
    const {map,id,per_kill,entry_fee,mode,game,time,img}= req.body
    const data= new Tournaments({
        id:await Tournaments.find().count()+1,
        entry_fee:entry_fee,
        per_kill: per_kill,
        map:map,
        mode: mode,
        game:game,
        time:time,
        image:img
    })

    await data.save()
    res.send("data has been saved")

})

router.get('/graphdata',async (req,res)=>{
    const graphs= await Graph.find()
    res.send(graphs)
})


router.get('/over/:id',async (req,res)=>{
    const game_id= req.params.id

    const {players,id}= await Tournaments.findOne({_id:game_id})
    const match_calc = players.length  

    const updateing_dat= await Tournaments.findOneAndUpdate({_id:game_id},{
        over:true
    })

    const room_id= `GameKhelo # ${game_id}`
    const room_pass= Math.floor(Math.random() * 100000000)

    for(let i=0; i<= players.length-1;i++){
        const registered_id=players[i]
        try{
            const user_notificaion= await Players.findOne({$and:[{id:registered_id.registered_id},{notifications:{$elemMatch:{room_id : room_id}}}]})

            if(user_notificaion == null){
                await Players.updateOne(
                    {id:registered_id.registered_id},
                    {
                        $push: {
                            notifications:[
                                {
                                    room_id:room_id,
                                    password:room_pass
                                }
                            ]
                        }
                        
                    }
                )
        
            }
            // console.log(user_notificaion)
            
            
            else{
                // console.log(user_match)
                 continue
            }
        }
        catch(e){
            console.log(e)
        }
        
    }
   

    

    const save_graph= new Graph({
        match_id:id,
        users: match_calc
    })

    await save_graph.save()
    res.send('done')
})

router.get('/get/freefire', async (req,res)=>{
    const saved_ff_tournaments= await Tournaments.find({game:0})
    res.send(saved_ff_tournaments)
})

router.get('/get/BGMi', async (req,res)=>{
    const saved_bgmi_tournaments= await Tournaments.find({game:1})
    res.send(saved_bgmi_tournaments)
})

router.get('/get/shadowfight', async (req,res)=>{
    try{
        const saved_sf_tournaments= await Tournaments.find({game:2})
        res.send(saved_sf_tournaments)
    }
    catch{
        res.send('no match')
    }
    
})

router.get('/getdata',async (req,res)=>{
    const users_data= await Players.count()
    const game_data= await Tournaments.count()
    res.json({users:users_data,games:game_data})
})


router.get('/getallgames',async (req,res)=>{
    const all_games_data = await Tournaments.find()
    res.send(all_games_data)
})


router.get('/get/:id', async (req,res)=>{
    const saved_tournament= await Tournaments.findById(req.params.id)
    res.send(saved_tournament)
})

router.delete('/delete', async (req,res)=>{
    const delete_tournaments= await Tournaments.deleteMany()
    res.json({delete_count:delete_tournaments.deletedCount,done:true})
})

router.delete('/delete/:id',async (req,res)=>{
    const delete_tournament= await Tournaments.findByIdAndDelete(req.params.id)
    if(delete_tournament){
        res.json({done:true})
    }
    else{
        res.status(400).send("not found ")
    }
})


module.exports=router;