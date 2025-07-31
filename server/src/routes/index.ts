import adminRoutes from './admin'
import contentAPIRoutes from './content-api'

const routes = {
  'admin': {
    type: 'admin',
    routes: adminRoutes,
  },
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
}

export default routes
