import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';


export let errorRate = new Rate('errors');


export const options = {
  stages: [
        { duration: '2s', target: 1 },  
        // { duration: '2s', target: 200 },  
        // { duration: '1s', target: 0 },  
        // { duration: '1s', target: 100 },  
    ],
  cloud: {
    projectID: 6202702,
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
    let payload1 = JSON.stringify({
        referral_code: "AGENTREF",
        email:'soknoy@k6.com',
    });

    let headers = { 'Content-Type': 'application/json' };
    let preRegister = http.post('https://htp-mobile-api.vai247.pro/api/v1/auth/pre-register', payload1, { headers });
    check(preRegister, {
        'status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    let session_id = preRegister.json().data.session_id;

   let payload2 = JSON.stringify({
        email: payload1.email,
        otp_code: "123456",
        session_id: session_id,
    });
    sleep(1);

    let verifyOtp = http.post('https://htp-mobile-api.vai247.pro/api/v1/auth/verify-otp', payload2, { headers });
    check(verifyOtp, {
        'status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    session_id = verifyOtp.json().data.session_id;

    let payload3 = JSON.stringify({
        password: "123456",
        verification_key: session_id,
    });
    sleep(1);

    let register = http.post('https://htp-mobile-api.vai247.pro/api/v1/auth/register', payload3, { headers });
    const success = check(register, {
        'status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    errorRate.add(!success);
    sleep(1);  
}
