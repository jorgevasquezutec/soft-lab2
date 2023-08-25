const http = require("http");

const backendServers = [
  { address: "localhost", port: 5000, weight: 5},
  { address: "localhost", port: 3001, weight: 2 },
  { address: "localhost", port: 3002, weight: 1 },
];

function selectServer(numReq) {
  for (let i = 0; i < backendServers.length; i++) {
      if( numReq % backendServers[i].weight == 0){
          return backendServers[i];
      }
  }
}

const numReq = 1;

const proxyServer = http.createServer((req, res) => {



  const selectedServer = selectServer(backendServers);

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
