import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';
import { config } from './config.js';

export let errorRate = new Rate('errors');


export const options = {
  stages: [
    { duration: '1s', target: 1 },    // warm up
  ],
  cloud: {
    projectID: config.cloud.projectID,
    name: "mobile-login.js",
  },
};

export default function() {
      let payload = JSON.stringify({
          email: config.credentials.mobile.email,
          password: config.credentials.mobile.password,
      });

      let headers = { 'Content-Type': 'application/json' };
      let login = http.post(`${config.baseUrls.mobile}/auth/login`, payload, { headers });
      console.log(login.json());
      const success = check(login, {
          'status is 200': () => login.json().status_code === 200,
      }) || errorRate.add(1);

      errorRate.add(!success);
      sleep(1);  // wait 1 second between iterations to simulate user think time
}
