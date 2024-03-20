const Bugsnag = require('@bugsnag/js')
const BugsnagPluginExpress = require('@bugsnag/plugin-express')

const bugsnag = Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  plugins: [BugsnagPluginExpress],
  enabledReleaseStages: ['production', 'development'],
  releaseStage: process.env.ENV || 'local',
})

const bugsnagMiddlewares = bugsnag.getPlugin('express')

module.exports = bugsnagMiddlewares