import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';
import { config } from './config.js';


export let errorRate = new Rate('errors');


export const options = {
  stages: [
    { duration: '2s', target: 1 },
    // { duration: '2s', target: 200 },
    // { duration: '1s', target: 0 },
    // { duration: '1s', target: 100 },
  ],
  cloud: {
    projectID: config.cloud.projectID,
    name: "mobile-registeration.js",
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
    // Step 1: Pre-register
    let email = randomString(10) + '@k6.com';
    let payload1 = JSON.stringify({
        referral_code: "AGENTREF",
        email: email,
    });

    let headers = { 'Content-Type': 'application/json' };
    let preRegister = http.post(`${config.baseUrls.mobile}/auth/pre-register`, payload1, { headers });
    check(preRegister, {
        'pre-register status is 200': () => preRegister.json().status_code === 200,
    }) || errorRate.add(1);
    let session_id = preRegister.json().data.session_id;

    // Step 2: Verify OTP
    let payload2 = JSON.stringify({
        email: email,
        otp_code: "123456",
        session_id: session_id,
    });
    sleep(1);

    let verifyOtp = http.post(`${config.baseUrls.mobile}/auth/verify-otp`, payload2, { headers });
    check(verifyOtp, {
        'verify-otp status is 200': () => verifyOtp.json().status_code === 200,
    }) || errorRate.add(1);

    session_id = verifyOtp.json().data.session_id;

    // Step 3: Register
    let payload3 = JSON.stringify({
        password: "123456",
        verification_key: session_id,
    });
    sleep(1);

    let register = http.post(`${config.baseUrls.mobile}/auth/register`, payload3, { headers });
    const success = check(register, {
        'register status is 200': () => register.json().status_code === 200,
    }) || errorRate.add(1);

    errorRate.add(!success);
    sleep(1);
}
