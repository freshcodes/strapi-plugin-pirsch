import { PLUGIN_ID } from './pluginId'

const PERMISSIONS = {
  dashboard: [{ action: `plugin::${PLUGIN_ID}.dashboard.read`, subject: null }],
  settings: [{ action: `plugin::${PLUGIN_ID}.settings.update`, subject: null }],
}

export { PERMISSIONS }
