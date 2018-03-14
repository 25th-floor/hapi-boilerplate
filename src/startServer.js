const Glue = require('glue');

const defaultManifest = require('./config/manifest');
const defaultOptions = { relativeTo: __dirname };

exports.startServer = async function (manifest = defaultManifest , options = defaultOptions) {
    try {
        const server = await Glue.compose(manifest, options);
        await server.start();
        server.log('✅  Server is listening on ' + server.info.uri.toLowerCase());
        return server;
    }
    catch (err) {
        console.log('server.register err:', err);
        process.exit(1);
    }
};
