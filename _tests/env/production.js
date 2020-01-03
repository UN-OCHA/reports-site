const env = {
  timeout: 5000,
  timeoutSnap: 15000,
  baseUrl: 'https://reports.unocha.org',
  fbAppId: '1916193535375038',
};

console.log('⚠️  E2E testing', env.baseUrl);

module.exports = env;
