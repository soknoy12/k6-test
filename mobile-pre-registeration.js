import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';
import { config } from './config.js';

export let errorRate = new Rate('errors');


export const options = {
  stages: [
    { duration: '1s', target: 1 },
  ],
  cloud: {
    projectID: config.cloud.projectID,
    name: "mobile-pre-registeration.js",
  },
};


function randomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

export default function () {
    let payload = JSON.stringify({
        referral_code: "AGENTREF",
        email: randomString(10) + '@k6.com',
    });

    let headers = { 'Content-Type': 'application/json' };
    let preRegister = http.post(`${config.baseUrls.mobile}/auth/pre-register`, payload, { headers });
    const success = check(preRegister, {
        'status is 200': () => preRegister.json().status_code === 200,
    }) || errorRate.add(1);

    errorRate.add(!success);
    sleep(1);  // wait 1 second between iterations to simulate user think time
}

