const Bugsnag = require('@bugsnag/js')
const BugsnagPluginExpress = require('@bugsnag/plugin-express')

Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginExpress],
  enabledReleaseStages: ['production', 'development'],
  releaseStage: process.env.ENV || 'local',
})

const bugsnagMiddlewares = Bugsnag.getPlugin('express')

module.exports = bugsnagMiddlewares