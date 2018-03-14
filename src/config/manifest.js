const appRoot = require('app-root-path');
const { version, pkgVersions } = require(`${appRoot}/package.json`);

const envKey = key => {
    const env = process.env.NODE_ENV || 'development';

    const configuration = {
        development: {
            host: '0.0.0.0',
            port: process.env.PORT || 8000
        },
        test: {
            host: '0.0.0.0',
            port: process.env.PORT || 8001
        },
        // These should match environment variables on hosted server
        production: {
            host: process.env.HOST || '0.0.0.0',
            port: process.env.PORT || 8000
        }
    };

    return configuration[env][key];
};

const manifest = {
    server: {
        host: envKey('host'),
        port: envKey('port'),
        routes: {
            cors: true
        },
        router: {
            stripTrailingSlash: true
        }
    },
    register:{
        plugins: [
            {
                plugin: require('inert'),
            },
            {
                plugin: require('vision'),
            },
            {
                plugin: './api',
                routes: {prefix: '/api'},
            },
            {
                plugin: require('hapi-swagger'),
                options: {
                    tags: [{
                        name: 'api',
                        description: 'Public user calls'
                    }],
                    info: {
                        description: 'This is the API',
                        version: version,
                        title: 'API',
                        contact: {
                            email: 'ts@25th-floor.com',
                        },
                        license: {
                            name: 'MIT',
                            url: 'https://opensource.org/licenses/MIT'
                        }
                    },
                    documentationPath: '/docs',
                }
            },
            {
                plugin: require('good'),
                options: {
                    reporters: {
                        console: [{
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{
                                log: '*',
                                response: '*',
                                error: '*',
                            }]
                        }, {
                            module: 'good-console',
                            args: [{format: 'DD.MM.YYYY hh:mm:ss'}],
                        }, 'stdout']
                    }
                }
            },
            {
                plugin: require('hapi-api-version'),
                options: {
                    validVersions: pkgVersions.validVersions,
                    defaultVersion: pkgVersions.apiVersion,
                    vendorName: 'unamed'
                }
            }
        ]
    }
};

module.exports = manifest;