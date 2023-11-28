const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/bizApi",
    createProxyMiddleware({
      target: "https://bizapi.giftishow.com",
      changeOrigin: true,
    })
  );
};
