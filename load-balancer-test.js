import { sleep } from 'k6';
import http from 'k6/http';

const host = 'http://localhost:8080';

export const options = {
  vus: 20,
  duration: '15s',
};

export default function() {
  // const payload = JSON.stringify({});
  //
  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  http.get(`${host}`);

  sleep(1);
}
