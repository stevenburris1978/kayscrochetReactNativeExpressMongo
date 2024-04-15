const { withDangerousMod } = require('@expo/config-plugins');

module.exports = function withPodsCustomizations(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(filePath, 'utf-8');
      
      if (!contents.includes('use_modular_headers!')) {

        contents = `use_modular_headers!\n${contents}`;
      }
      
      fs.writeFileSync(filePath, contents);
      return config;
    }
  ]);
};
