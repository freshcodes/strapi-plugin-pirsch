import type { Core } from '@strapi/strapi'

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the Pirsch Analytics Dashboard',
      uid: 'dashboard.read',
      pluginName: 'pirsch',
    },
    {
      section: 'settings',
      category: 'pirsch',
      displayName: 'Update Pirsch Analytics Settings',
      uid: 'settings.update',
      pluginName: 'pirsch',
    },
  ]

  strapi.service('admin::permission').actionProvider.registerMany(actions)
}

export default bootstrap
