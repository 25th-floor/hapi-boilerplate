const { Pool } = require('pg');
// const R = require('ramda');
// const sqlFormatter = require("sql-formatter");

const env = process.env.NODE_ENV || 'development';
let config;
let pool;
//let counter = 0;

function initializeConnection(server, next){
    pool = new Pool(config);
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', client, err);
        process.exit(-1);
    });
    next();
}

async function closeConnection(server, next){
    await pool.end();
    next();
}

async function query(SQL, args) {

    //TODO impl flag for sql output
    /*  counter ++;
    if(R.is(Object,SQL)){
        console.info(`QUERY ${counter}#\n`);
        console.info(sqlFormatter.format(SQL.text,{ indent: "    "}));
    }else{
        console.info(`QUERY ${counter} #\n`);
        console.info(sqlFormatter.format(SQL,{ indent: "    "}));
    }
 */
    try {
        return  await pool.query(SQL, args);
    } catch (error) {
        console.error(error);
        return Error(error);
    }
}

exports.getClient = async function() {
    return await pool.connect();
};

exports.query = query;

exports.register = function(server, options, next) {
    config = options[env];
    server.ext('onPreStart', initializeConnection);
    server.ext('onPreStop', closeConnection);
    next();
};

exports.register.attributes = {
    name: 'test',
    version: '1.0.0'
};