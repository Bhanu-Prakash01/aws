const express= require('express')

const app = express()


app.get('/',(req,res)=>{
    res.send('server is running perfectly fine')
})


const p=process.env.PORT || 8000

app.listen(p,()=>{
    console.log(`server is running ${p}`)
})
