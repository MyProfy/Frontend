/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,

  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'myprofy.uz',
      },

      {
        protocol: 'https',
        hostname: 'via.placeholder.com', 
      },
    ],
  },

  swcMinify: true,

  experimental: {

    optimizeCss: true,

    optimizePackageImports: ['framer-motion', 'react-i18next'],
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {

      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };

      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },

          framerMotion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },

          lib: {
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier())
              );
            },
            name(module) {
              const hash = crypto.createHash('sha1');
              hash.update(module.identifier());
              return hash.digest('hex').substring(0, 8);
            },
            priority: 20,
            minChunks: 1,
            reuseExistingChunk: true,
          },

          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './src/components',
      '@contexts': './src/contexts',
      '@types': './src/types',
      '@utils': './src/utils',
    };

    return config;
  },

  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/search/:category',
        destination: '/search?category=:category',
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  output: 'standalone',


  typescript: {
    ignoreBuildErrors: false,
  },

  // Игнорировать ESLint ошибки при сборке (опционально)
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Настройки i18n если используется
  i18n: {
    locales: ['ru', 'uz'],
    defaultLocale: 'ru',
    localeDetection: true,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Настройки для production
  productionBrowserSourceMaps: false, // Отключить source maps в production
  poweredByHeader: false, // Убрать X-Powered-By header
};

module.exports = nextConfig;

// ============================================
// ДОПОЛНИТЕЛЬНАЯ КОНФИГУРАЦИЯ ДЛЯ PWA
// ============================================

// Если нужен PWA, установите: npm install next-pwa
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/myprofy\.uz\/api\/.*/i,
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'api-cache',
//         expiration: {
//           maxEntries: 50,
//           maxAgeSeconds: 300, // 5 минут
//         },
//         networkTimeoutSeconds: 10,
//       },
//     },
//     {
//       urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'image-cache',
//         expiration: {
//           maxEntries: 100,
//           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
//         },
//       },
//     },
//   ],
// });

// module.exports = withPWA(nextConfig);

// ============================================
// BUNDLE ANALYZER
// ============================================

// Для анализа размера bundle
// Установите: npm install @next/bundle-analyzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// module.exports = withBundleAnalyzer(nextConfig);

// ============================================
// ИСПОЛЬЗОВАНИЕ С НЕСКОЛЬКИМИ ПЛАГИНАМИ
// ============================================

// const withPlugins = require('next-compose-plugins');
// module.exports = withPlugins([
//   [withPWA],
//   [withBundleAnalyzer],
// ], nextConfig);

