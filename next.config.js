const withPWA = require("next-pwa");
require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    FLWPUBK: "FLWPUBK_TEST-43652cb1a80c18631af2ecd1ed461875-X",
  },
};

module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);
