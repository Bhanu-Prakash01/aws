const express=require('express');
const router=express.Router();
const Player=require('../../models/tournaments/players')
const bcrypt=require('bcrypt')
const Tournaments=require('../../models/tournaments/tournaments');

router.post('/post', async (req,res)=>{
    console.log(req.body)
    const {name,password,number}=req.body
    console.log(name)
    try{
        const searching_user= await Player.findOne({name:name})
        if(!searching_user){
            const data= await Player({
                id: await Player.find().count()+1,
                name:name,
                password: await bcrypt.hash(password, 10),
                number:number
            })
        
            await data.save()
            res.send('user name is added')
        }
        else{
            res.send('user name is already exist')
        }
    }
    catch(e){
        console.log(e)
    }
    
})

router.get('/get', async (req,res)=>{
   const saved_users= await Player.find()
   res.send(saved_users)
})

router.get('/get/:id', async (req,res)=>{
    const player_details= await Player.findOne({id:req.params.id})
    res.send(player_details)
 })

router.post('/login', async (req,res)=>{
    console.log(req.body)
    const {name,password}=req.body
    try{
        const searching_user_password= await Player.findOne({name:name})
        const d= await bcrypt.compare(password,searching_user_password.password)
        if(d){
            const {id}=searching_user_password
            res.send(`${id}`)
        }
        else{
            res.status(400).send('username or password is worng')
        }
    }
    catch(e){
        res.status(401).send('username is does not exist')
    }
    

})

router.post('/money/update', async (req,res)=>{
    const {id,money}=req.body
    const updating_the_user= await Player.findOneAndUpdate({game:id},{
        money:money,
        matchPlayed: 0,
        totalkills:0
    })

    res.status(200).send('ok')

})

router.put('/update', async (req,res)=>{
    const {name,matchplayed,totalkills}=req.body
    const match_update= await Player.findOneAndUpdate({name:name},{
        matchPlayed: matchplayed,
        totalkills:totalkills
    })

    res.send('done')

})


router.put('/registration', async (req,res)=>{
    const {name,id}=req.body

    const user_match= await Tournaments.findOne({$and:[{id:id},{players:name}]})

    if(user_match == null){
        await Tournaments.updateOne(
            {id:id},
            {
                $push: {
                    players:[name]
                }
                
            }
        )

        res.send(user_match)
    }
    else{
        console.log(user_match)
        res.status(404).send('you are already here')
    }

    
    
})


module.exports=router;