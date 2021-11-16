const express=require('express');
const router=express.Router();
const Player=require('../../models/tournaments/players')
const Tournaments=require('../../models/tournaments/tournaments');
const msg = require('../../models/tournaments/msg');
const players = require('../../models/tournaments/players');

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
                password: password,
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
        if(password == searching_user_password.password.toString()){
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
    
    const money_d=await Player.findOne({id:id})

    const m_d=money_d.money
    const updating_the_user= await Player.findOneAndUpdate({id:id},{
        money: m_d + parseInt(money),
        matchPlayed: 0,
        totalkills:0
    })

    res.status(200).send('ok')

})

router.post('/money/withdraw', async (req,res)=>{
    const {id,money,upi}=req.body
    const money_d=await Player.findOne({id:id})

    const m_d=money_d.money
    if(m_d >= money){

        const updating_the_user= await Player.findOneAndUpdate({id:id},{
            money:m_d - money,
            matchPlayed: 0,
            totalkills:0
        })

        
        const request_money= await msg({
            userid:id,
            money:money,
            upi:upi
        })

        await request_money.save()
        res.status(200).send('ok')
    }else{
        res.status(400).send('low balance')
    }

})


router.put('/update', async (req,res)=>{
    const {name,matchplayed,totalkills}=req.body
    const match_update= await Player.findOneAndUpdate({name:name},{
        matchPlayed: matchplayed,
        totalkills:totalkills
    })

    res.send('done')

})

router.post('/reg_test',async (req,res)=>{
    const {name,id}=req.body

    const user_match= await Tournaments.findOne({$and:[{id:id},{players:name}]})

    if(user_match == null){
       res.status(200).send()
    }

    else{
        console.log(user_match)
        res.status(400).send()
    }
})

router.post('/registration', async (req,res)=>{
    const {name,id,reg_id,money}=req.body
    
    const player_ess= await players.findOne({id:reg_id})
    const player_money= player_ess.money
    // const user_match= await Tournaments.findOne({$and:[{id:id},{players:{$elemMatch:{name:name}}}]})

    // res.send(user_match)
    if(player_money >= money){

        const user_match= await Tournaments.findOne({$and:[{id:id},{players:{$elemMatch:{name:name}}}]})

        if(user_match == null){
            await Tournaments.updateOne(
                {id:id},
                {
                    $push: {
                        players:[
                            {
                                registered_id:reg_id,
                                name:name
                            }
                        ]
                    }
                    
                }
            )

            const o_money= await players.findOne({id:reg_id})
            const after_money = o_money.money - money

            const money_died_players= await players.findOneAndUpdate({id:reg_id},{
                money: after_money
            })

            await money_died_players.save()

            res.send('user is added')
        }
        else{
            // console.log(user_match)
            res.status(400).send('you are already here')
        }

    }
    else{
        res.status(400).send('low balance')
    }
    
})


module.exports=router;