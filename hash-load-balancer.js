const http = require("http");
const crypto = require("crypto");
const fs = require('fs');

const backendServers = JSON.parse(fs.readFileSync('backendServers.json', 'utf8'));

console.log({ backendServers });

function hashServer(key) {
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const hashBigInt = BigInt("0x" + hash);
  const serverIndex = Number(hashBigInt % BigInt(backendServers.length));

  return backendServers[serverIndex];
}

const proxyServer = http.createServer((req, res) => {
  const clientIP = crypto.randomUUID();
  const selectedServer = hashServer(clientIP);

  console.log({ selectedServer })

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
