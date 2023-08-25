const http = require("http");
const fs = require('fs');


const backendServers = JSON.parse(fs.readFileSync('backendServers.json', 'utf8'));

backendServers.sort((a, b) => {
  if (a.weight > b.weight) {
    return -1;
  }

  if (a.weight < b.weight) {
    return 1;
  }

  return 0;
})

console.log({ backendServers });

function selectServer(servers) {
  for (let i = 0; i < servers.length; i++) {
    servers[i].currentWeight += 1;
    if (i == servers.length - 1) {
      if (servers[i].currentWeight <= servers[i].weight) {
        return servers[i];
      } else {
        for (const server of servers) {
          server.currentWeight = 0;
        }

        servers[0].currentWeight += 1;
        return servers[0];
      }
    }

    if (servers[i].currentWeight <= servers[i].weight) {
      return servers[i];
    }
  }
}

const proxyServer = http.createServer((req, res) => {
  const selectedServer = selectServer(backendServers);
  console.log({ selectedServer });

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
