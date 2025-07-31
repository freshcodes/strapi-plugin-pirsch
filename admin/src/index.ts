// import { getTranslation } from './utils/getTranslation'
import { PLUGIN_ID } from './pluginId'
import { Initializer } from './components/Initializer'
import { PluginIcon } from './components/PluginIcon'
import { StrapiApp } from '@strapi/strapi/admin'

export default {
  register(app: StrapiApp) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      // @ts-expect-error can't make it happy
      Component: async () => {
        const { App } = await import('./pages/App')

        return App
      },
    })

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
