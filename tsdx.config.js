module.exports = {
  rollup(config, options) {
    config.external = id => {
      if (
        id.startsWith('@beehive') ||
        id.startsWith('./') ||
        id.startsWith('/Users/')
      ) {
        return false;
      } else {
        return true;
      }
    };
    return config;
  },
};
