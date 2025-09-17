/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://skillvoyager.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/debug-auth',
    '/api/*',
    '/admin/*',
    '/private/*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/debug-auth',
          '/api/',
          '/admin/',
          '/private/'
        ]
      }
    ],
    additionalSitemaps: [
      'https://skillvoyager.vercel.app/sitemap.xml'
    ]
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }

    // Higher priority for important pages
    if (path === '/') {
      customConfig.priority = 1.0
      customConfig.changefreq = 'daily'
    } else if (path.includes('/careerguru') || path.includes('/interview-simulator')) {
      customConfig.priority = 0.9
      customConfig.changefreq = 'weekly'
    } else if (path.includes('/games') || path.includes('/quiz')) {
      customConfig.priority = 0.8
      customConfig.changefreq = 'weekly'
    }

    return customConfig
  }
}