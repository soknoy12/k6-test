import http from "k6/http";
import { sleep, check } from "k6";
import { Rate } from "k6/metrics";
import { config } from "./config.js";

export let errorRate = new Rate("errors");

export const options = {
  stages: [{ duration: "1s", target: 20 }],
  cloud: {
    projectID: config.cloud.projectID,
    name: "mobile-card-request.js",
  },
};

export default function () {
  // Step 1: Login to get authentication token
  let loginPayload = JSON.stringify(config.credentials.mobile);

  let headers = { "Content-Type": "application/json" };
  let loginResponse = http.post(
    `${config.baseUrls.mobile}/auth/login`,
    loginPayload,
    { headers }
  );

  // Check if login was successful
  let loginSuccess = check(loginResponse, {
    "login status is 200": (r) => r.json().status_code === 200,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    return; // Exit if login failed
  }

  // Extract token from login response
  let token = loginResponse.json().data.access_token;

  // Step 2: Make card request with authentication
  let cardRequestPayload = JSON.stringify({
    address: "China",
    card_type: "VIRTUAL",
    country_id: 5,
    merchant_order_sn: "12321312Acd",
    post_code: 1209,
  });

  let authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let cardRequest = http.post(
    `${config.baseUrls.mobile}/card-request`,
    cardRequestPayload,
    { headers: authHeaders }
  );

  let success =
    check(cardRequest, {
      "status is 200": () => cardRequest.json().status_code === 200,
    }) || errorRate.add(1);

  errorRate.add(!success);
  sleep(1);
}
