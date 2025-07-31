import type { Core } from '@strapi/strapi'

interface PirschSettings {
  pirschUrl: string
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getDashboardConfig(ctx) {
    try {
      const config = (await strapi
        .store({
          type: 'plugin',
          name: 'pirsch',
        })
        .get({ key: 'settings' })) as PirschSettings | null

      // Only return pirschUrl for dashboard users
      ctx.send({ data: { pirschUrl: config?.pirschUrl || '' } })
    } catch (error) {
      console.error('Failed to fetch dashboard config:', error)
      ctx.throw(500, 'Failed to fetch dashboard config')
    }
  },

  async getSettings(ctx) {
    try {
      const config = (await strapi
        .store({
          type: 'plugin',
          name: 'pirsch',
        })
        .get({ key: 'settings' })) as PirschSettings | null

      ctx.send({ data: config || { pirschUrl: '' } })
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      ctx.throw(500, 'Failed to fetch settings')
    }
  },

  async updateSettings(ctx) {
    const { pirschUrl } = ctx.request.body

    // Validate URL
    if (pirschUrl && pirschUrl.trim()) {
      try {
        new URL(pirschUrl)
      } catch {
        return ctx.throw(400, 'Invalid URL format')
      }
    }

    try {
      await strapi
        .store({
          type: 'plugin',
          name: 'pirsch',
        })
        .set({
          key: 'settings',
          value: { pirschUrl: pirschUrl?.trim() || '' },
        })

      ctx.send({ data: { pirschUrl: pirschUrl?.trim() || '' } })
    } catch (error) {
      console.error('Failed to update settings:', error)
      ctx.throw(500, 'Failed to update settings')
    }
  },
})
