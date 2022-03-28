require("@babel/core").transform("code", {
    presets: ["@babel/preset-env"],
})

/** @jsx h */

import http from 'http';

const PORT = 4001;
const server = http.createServer((req, res) => {
    res.end('Hello from the server');
}).listen(PORT);

console.log(`Server is up and running at ${PORT}`)

export default server;
