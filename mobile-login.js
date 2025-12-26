import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');


export const options = {
 stages: [
  { duration: '1s', target: 1 },    // warm up
],
  cloud: {
    projectID: 6202702,
    name: "mobile-login.js",
  },
};

export default function() {
      let payload1 = JSON.stringify({
          email: 'soknoy@k6.com',
          password: '123456',
      });
  
      let headers = { 'Content-Type': 'application/json' };
      let login = http.post('https://htp-mobile-api.vai247.pro/api/v1/auth/login', payload1, { headers });
      console.log(login.json());
      const success = check(login, {
          'status is 200': (r) => login.json().status_code === 200,
      }) || errorRate.add(1);
      
      errorRate.add(!success);
      sleep(1);  // wait 1 second between iterations to simulate user think time
}
