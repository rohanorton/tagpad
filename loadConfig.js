let appName = require(__dirname + '/package.json').name;
export default require(process.env.HOME + '/' + appName + '_config.js');
