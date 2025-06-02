require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

const withPWA = require("next-pwa");
module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

module.exports = {
  env: {
    FLWPUBK: "FLWPUBK_TEST-43652cb1a80c18631af2ecd1ed461875-X",
  },
};

module.exports = nextConfig;
