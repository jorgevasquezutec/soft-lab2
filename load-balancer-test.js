import http from 'k6/http';

const host = 'http://localhost:8080';

export const options = {
  vus: 500,
  duration: '60s',
};

export default function() {
  // const payload = JSON.stringify({});
  //
  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  http.get(`${host}/hello`);

  sleep(1);
}
