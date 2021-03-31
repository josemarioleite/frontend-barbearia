module.exports = function (/* ctx */) {
  return {
    supportTS: false,
    boot: [
      'i18n',
      'axios',
    ],
    css: [
      'app.sass'
    ],
    extras: [
      'roboto-font',
      'material-icons',
      'fontawesome-v5'
    ],
    build: {
      vueRouterMode: 'hash',
      devtool: 'source-map',
      extendWebpack (cfg) {
cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      },
    },
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'pt-br', // Quasar language pack
      config: {
        loading: {}
      },
      importStrategy: 'auto',
      plugins: ['Notify', 'Dialog', 'Loading']
    },
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: `Barber Soft`,
        short_name: `Barber Soft`,
        description: `Uma aplicação para Barbearias`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'public/icons/favicon-16x16.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'public/icons/favicon-32x32.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'public/icons/favicon-96x96.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'public/icons/favicon-128x128.png',
            sizes: '384x384',
            type: 'image/png'
          }
        ]
      }
    },
    cordova: {},
    capacitor: {
      hideSplashscreen: true
    },
    electron: {
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'barbersoft'
      },
      nodeIntegration: true,
      extendWebpack (/* cfg */) {
      }
    }
  }
}
