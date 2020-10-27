const config = {
  environment: process.env.NODE_ENV,
  serverURL: process.env.SERVER_URL || 'http://localhost',
  appcenterToken: process.env.APPCENTER_TOKEN,
  users: [],
};

if (config.environment === 'development') {
  config.users.push({
    id: "0",
    user: 'root',
    pass: 'rootuser',
  });
}

if (process.env.USER_1_USERNAME && process.env.USER_1_PASSWORD) {
  config.users.push({
    id: "1",
    user: process.env.USER_1_USERNAME,
    pass: process.env.USER_1_PASSWORD,
    appcenterToken: process.env.USER_1_APPCENTER_TOKEN,
  });
}

if (process.env.USER_2_USERNAME && process.env.USER_2_PASSWORD) {
  config.users.push({
    id: "2",
    user: process.env.USER_2_USERNAME,
    pass: process.env.USER_2_PASSWORD,
    appcenterToken: process.env.USER_2_APPCENTER_TOKEN,
  });
}

if (process.env.USER_3_USERNAME && process.env.USER_3_PASSWORD) {
  config.users.push({
    id: "3",
    user: process.env.USER_3_USERNAME,
    pass: process.env.USER_3_PASSWORD,
    appcenterToken: process.env.USER_3_APPCENTER_TOKEN,
  });
}

module.exports = config;