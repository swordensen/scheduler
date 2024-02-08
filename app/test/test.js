let count = 1;

const myInterval = setInterval(()=>{
    if(count > 10) return clearInterval(myInterval);
    console.log(count);
    count++;
}, 1000)