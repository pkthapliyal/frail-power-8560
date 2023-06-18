
process.nextTick(()=>{
    console.log('hello form next tick')
})
console.log('hello usually')
const arr = [1,2,3,45,4]

let ans = arr.reduce((acc, curr)=> acc + curr/2)

console.log(ans)