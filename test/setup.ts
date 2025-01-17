export default () => {
  process.env.NODE_ENV = "development";
  process.env.CDN_HOST = "CDN_HOST";
  process.env.COOKIE_SECRET = "123456789123456789123456789";
  process.env.COOKIE_DOMAIN = "test";
  process.env.CACHE_SERVER = "test";
  process.env.SHOW_SERVICE_OFFLINE_PAGE = "false";
  process.env.API_URL = "test";
  process.env.CHS_API_KEY = "test";
  process.env.CHS_URL = "test";
  process.env.PIWIK_URL = "test";
  process.env.PIWIK_SITE_ID = "test";
  process.env.PIWIK_START_GOAL_ID = "test";
  process.env.FEATURE_FLAG_ENABLE_TRUST_INFO_16062022 = "1";
  process.env.PAYMENT_FEE = "100";
  process.env.LANDING_PAGE_URL = "/register-an-overseas-entity/sold-land-filter?start=0";
};
