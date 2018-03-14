const Joi = require('joi');
const appRoot = require('app-root-path');
const {
    version, 
    pkgVersions: {
        apiVersion = 1,
        validVersions = [1],
    } 
} = require(`${appRoot}/package.json`);

module.exports = {
    id: 'Status',
    tags: ['api'],
    description: 'returns version of the api',
    notes:'Returns all versioning information',
    plugins: {
        'hapi-swagger': {
            responses: {
                '200': {
                    description: "Home",
                    schema: Joi.object({
                        "version": Joi
                            .string()
                            .example('1.2.3'),
                        "git": Joi
                            .string()
                            .example('964aa95'),
                        "apiVersion": Joi
                            .number()
                            .example(1),
                        "buildNumber": Joi
                            .number()
                            .example(42),
                        "validVersions": Joi
                            .array()
                            .items(
                                Joi.string()
                            ).example([1,2]),
                    }),
                },
                '400':{
                    description: 'Bad Request',
                },
                '404':{
                    description: 'Not Found',
                }
            },
        },
    },
    handler: () => ({
        version,
        apiVersion: apiVersion,
        validVersions: validVersions,
    }),
};
