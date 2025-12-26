# k6 Load Testing

Run k6 load tests from the command line and execute them in k6 Cloud.

## Prerequisites

- [k6 Cloud account](https://app.k6.io/)
- Command-line access
- Homebrew (macOS)

## Installation

### macOS

```bash
brew install k6
```

### Other Platforms (Linux / Windows / Docker)

See official documentation:
[https://grafana.com/docs/k6/latest/get-started/installation](https://grafana.com/docs/k6/latest/get-started/installation)

## Setup & Configuration

### Login to k6 Cloud

Authenticate your local CLI with k6 Cloud.

```bash
k6 cloud login --token <YOUR_K6_CLOUD_TOKEN>
```

Example:

```bash
k6 cloud login --token beca65d4497248f07010ed36fdb9d2a6f2d4sdfec213asdfae5203e141a93bc0dcc0e1
```

### Create a Test Script

Generate a new test file linked to your cloud project.

```bash
k6 new test.js --project-id 6202702
```

## Available Scripts

This repository contains the following test scenarios:

- `htp-admin-login.js` - Admin login load test
- `mobile-login.js` - Mobile login load test
- `mobile-pre-registeration.js` - Mobile pre-registration flow
- `mobile-registeration.js` - Mobile registration flow

## Running Tests

### Run on k6 Cloud

Execute the test in k6 Cloud. Results appear in real time on the k6 Cloud dashboard.

```bash
k6 cloud run <script-name.js>
```

Example:

```bash
k6 cloud run mobile-login.js
```

### Run Locally

You can also run tests locally for debugging:

```bash
k6 run mobile-login.js
```
