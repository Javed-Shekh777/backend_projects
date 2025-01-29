const http = require("http");

const server1 = http.createServer((req,res)=>{
    res.end("Server One");
});

const server2 = http.createServer((req,res)=>{
    res.end("Server Two");
});

server1.listen(8080);
server2.listen(9000);
