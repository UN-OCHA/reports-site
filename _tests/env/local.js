const env = {
  timeout: 15000,
  timeoutSnap: 15000,
  baseUrl: 'http://dev.dsr.local',
  fbAppId: '1916193535375038',
};

console.log('⚠️  E2E testing', env.baseUrl);

module.exports = env;
