const redis = require('redis')
const redisClient = redis.createClient();




redisClient.connect()
redisClient.on('connect', async()=>{
    console.log('connected to redis')
})

async function main(){
await redisClient.SETEX("hhh", 5, "hello")
    let x = await redisClient.get('hhh')
    console.log(x)

    setTimeout(async()=>{
        console.log(await redisClient.get("hhh"))
    }, 5500)
}

main()



module.exports = {redisClient}