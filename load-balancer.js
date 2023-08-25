const http = require("http");

const backendServers = [
  { address: "localhost", port: 3000, weight: 5, currentWeight: 0 },
  { address: "localhost", port: 3000, weight: 2, currentWeight: 0 },
  { address: "localhost", port: 3000, weight: 1, currentWeight: 0 },
];

function selectServer(servers) {
  for (const server in servers) {
    server.currentWeight += 1;
    if (server.currentWeight <= server.weight) {
      return server;
    }
  }
}

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
