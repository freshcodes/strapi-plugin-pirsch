import { PLUGIN_ID } from './pluginId'
import { Initializer } from './components/Initializer'
import { PluginIcon } from './components/PluginIcon'
import { PERMISSIONS } from './permissions'
import { StrapiApp } from '@strapi/strapi/admin'

export default {
  register(app: StrapiApp) {
    // Main plugin menu
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Pirsch Analytics',
      },
      permissions: PERMISSIONS.dashboard,
      // @ts-expect-error can't make it happy
      Component: async () => {
        const { HomePage } = await import('./pages/HomePage')

        return HomePage
      },
    })

    // Add settings link to Strapi settings panel
    app.addSettingsLink(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.settings.section-label`,
          defaultMessage: 'Pirsch Analytics',
        },
      },
      {
        intlLabel: {
          id: `${PLUGIN_ID}.settings.title`,
          defaultMessage: 'Configuration',
        },
        id: 'settings',
        to: `${PLUGIN_ID}`,
        permissions: PERMISSIONS.settings,
        // @ts-expect-error can't make it happy
        Component: async () => {
          const { ProtectedSettingsPage } = await import('./pages/SettingsPage')

          return ProtectedSettingsPage
        },
      },
    )

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    })
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`)

          return { data, locale }
        } catch {
          return { data: {}, locale }
        }
      }),
    )
  },
}
