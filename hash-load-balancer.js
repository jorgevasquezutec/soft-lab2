const http = require("http");
const crypto = require("crypto");
const fs = require('fs');

//read file backendServers.json

const backendServers = JSON.parse(fs.readFileSync('backendServers.json', 'utf8'));

// const backendServers = [
//   { address: "localhost", port: 3000 },
//   { address: "localhost", port: 3001 },
//   { address: "localhost", port: 3002 },
// ];

function hashServer(key) {
  const hash = crypto.createHash("md5").update(key).digest("hex");
  const serverIndex = parseInt(hash, 16) % backendServers.length;
  return backendServers[serverIndex];
}

const proxyServer = http.createServer((req, res) => {
  // const clientIP = req.connection.remoteAddress;
  //randomValue 
  const clientIP = Math.random().toString();
  const selectedServer = hashServer(clientIP);

  const proxyRequest = http.request(
    {
      host: selectedServer.address,
      port: selectedServer.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyResponse) => {
      res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.pipe(res, { end: true });
    }
  );

  req.pipe(proxyRequest, { end: true });
});

proxyServer.listen(8080, () => {
  console.log("Proxy server listening on port 8080");
});
