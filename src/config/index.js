const config = {
  serverURL: process.env.SERVER_URL || 'http://localhost',
  appcenterToken: process.env.APPCENTER_TOKEN,
  users: [
    {
      "id": "1",
      "user": process.env.USER_1_USERNAME,
      "pass": process.env.USER_1_PASSWORD,
    },
    {
      "id": "2",
      "user": process.env.USER_2_USERNAME,
      "pass": process.env.USER_2_PASSWORD,
    },
  ],
};

module.exports = config;