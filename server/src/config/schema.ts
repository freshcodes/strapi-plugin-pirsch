export default {
  pirschUrl: {
    type: 'string',
    default: '',
    validator: (value: string) => {
      if (!value) return true // Allow empty for initial setup
      try {
        new URL(value)
        return true
      } catch {
        throw new Error('Invalid URL format')
      }
    },
  },
}
