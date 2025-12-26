// Configuration for k6 tests
export const config = {
  baseUrls: {
    admin: 'https://htp-admin-api.vai247.pro/api/v1',
    agent: 'https://htp-admin-api.vai247.pro/api/v1',
    mgr: 'https://htp-card-mgr-api.vai247.pro/api/v1',
    mobile: 'https://htp-mobile-api.vai247.pro/api/v1',
  },

  // Cloud configuration
  cloud: {
    projectID: 6228592,
  },

  // Default test credentials (use test accounts only)
  credentials: {
    admin: {
      username: 'super_admin',
      password: '123456',
    },
    mobile: {
      email: 'cham1@gmail.com',
      password: '123456',
      phone_code: '855',
      phone_number: '213123123',
    },
    mgr: {
      username: 'cham_name_tier1',
      password: '123456',
    },
    agent: {
      username: 'cham_name_tier1',
      password: '123456'
      }
  },
};
