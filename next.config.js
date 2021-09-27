module.exports = {
  webpack5: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [{ removeViewBox: false }],
            },
          },
        },
      ],
    });
    config.node = {
      fs: "empty",
      child_process: "empty",
      net: "empty",
      dns: "empty",
      tls: "empty",
    };

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/settings/profile",
        permanent: true,
      },
    ];
  },
};
