'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    dev: {

        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/dataHandle':  {  //数据采集
                target:   'http://116.131.7.1:21300/dataHandle',
                //target: 'http://192.168.171.43:61001/DataReceiving-Service',
                 pathRewrite:  {                  
                    '^/dataHandle':   '/'               
                }            
            },
            '/basicData':  {  // 基础服务
                target:   'http://116.131.7.1:21300/basicData',
                pathRewrite:  {         
                    '^/basicData':   '/'                
                }            
            },
            '/IdentityManagement': { //系统管理服务
                target: 'http://116.131.7.1:21300/IdentityManagement',
                // target: 'http://192.168.171.43:60008/IdentityManagement', // 刘乐法
                pathRewrite: {
                    '^/IdentityManagement': '/'
                }
            },
            '/Statistics-Service': { //综合应用服务
                target: 'http://116.131.7.1:21300/Statistics-Service',
                // target: 'http://192.168.171.45:43033/Statistics-Service', // 刘乐法
                pathRewrite: {
                    '^/Statistics-Service': '/'
                }
            },
            '/waterEnvXA': { //水环境管理服务（雄安新区）
                target: 'http://116.131.7.1:21300/waterEnvXA',
                //  target: 'http://192.168.171.34:43011/waterEnvXA',
                pathRewrite: {
                    '^/waterEnvXA': '/'
                }
            },
            '/planTaskCheck': { //计划任务模块
                target: 'http://116.131.7.1:21300/planTaskCheck',
                // target: 'http://192.168.171.43:43021/planTaskCheck',
                pathRewrite: {
                    '^/planTaskCheck': '/'
                }
            }
        },

        // Various Dev Server settings
        host: '0.0.0.0', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}