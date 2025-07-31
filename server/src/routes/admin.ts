export default [
  {
    method: 'GET',
    path: '/dashboard',
    handler: 'settings.getDashboardConfig',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        { name: 'admin::hasPermissions', config: { actions: ['plugin::pirsch.dashboard.read'] } },
      ],
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'settings.getSettings',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        { name: 'admin::hasPermissions', config: { actions: ['plugin::pirsch.settings.update'] } },
      ],
    },
  },
  {
    method: 'PUT',
    path: '/settings',
    handler: 'settings.updateSettings',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        { name: 'admin::hasPermissions', config: { actions: ['plugin::pirsch.settings.update'] } },
      ],
    },
  },
]
