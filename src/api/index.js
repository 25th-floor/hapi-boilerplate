const Status = require('./handlers/Status');

exports.register = async (plugin) => await plugin.route([
    { method: 'GET' , path: '/', config: Status },
]);

exports.name = 'api';