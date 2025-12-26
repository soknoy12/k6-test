import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';
import { config } from './config.js';

export let errorRate = new Rate('errors');


export const options = {
  stages: [
        { duration: '1s', target: 20 },
    ],
  cloud: {
    projectID: config.cloud.projectID,
    name: "htp-admin-login.js",
  },
};

export default function () {
    let payload = JSON.stringify(config.credentials.admin);

    let headers = { 'Content-Type': 'application/json' };
    let loginResponse = http.post(`${config.baseUrls.admin}/admin/auth/login`, payload, { headers });
    let success = check(loginResponse, {
        'status is 200': () => loginResponse.json().status_code === 200,
    }) || errorRate.add(1);

    errorRate.add(!success);
    sleep(1);  // wait 1 second between iterations to simulate user think time
}