// Configuration for k6 tests
export const config = {
  baseUrls: {
    admin: 'https://your-admin-api.example.com/api/v1',
    agent: 'https://your-agent-api.example.com/api/v1',
    mgr: 'https://your-mgr-api.example.com/api/v1',
    mobile: 'https://your-mobile-api.example.com/api/v1',
  },

  // Cloud configuration
  cloud: {
    projectID: 1234567,
  },

  // Default test credentials (use test accounts only)
  credentials: {
    admin: {
      username: 'admin_user',
      password: '123456',
    },
    mobile: {
      email: 'mobile@example.com',
      password: '123456',
      phone_code: '855',
      phone_number: '213123123',
    },
    mgr: {
      username: 'mgr_user',
      password: '123456',
    },
    agent: {
      username: 'agent_user',
      password: '123456',
    },
  },
};
