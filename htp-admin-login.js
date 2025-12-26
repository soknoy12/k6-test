import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');


export const options = {
  stages: [
        { duration: '1s', target: 20 }, 
    ],
  cloud: {
    projectID: 6202702,
    name: "htp-admin-login.js",
  },
};

export default function () {
    // Example GET request
    let payload1 = JSON.stringify({
        password: "123456",
        username: 'super_admin',
    });

    let headers = { 'Content-Type': 'application/json' };
    let preRegister = http.post('https://htp-admin-api.vai247.pro/api/v1/admin/auth/login', payload1, { headers });
    let success =check(preRegister, {
        'status is 200': (r) => preRegister.json().status_code === 200,
    }) || errorRate.add(1);

    errorRate.add(!success);
    sleep(1);  // wait 1 second between iterations to simulate user think time
}