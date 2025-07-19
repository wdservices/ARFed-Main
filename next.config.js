const withPWA = require("next-pwa");
require("dotenv").config();

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  env: {
    FLWPUBK: "FLWPUBK_TEST-43652cb1a80c18631af2ecd1ed461875-X",
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    // No Next.js options here!
  },
});
