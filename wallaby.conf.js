module.exports = function (wallaby) {
    // process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/hapi_test';
    // process.env.TZ = 'UTC';
    process.env.NODE_ENV = 'test';
    return {
        // src files to watch
        files: [
            'src/**/*.js',
            '!src/**/*.test.js',
        ],
        // test files
        tests: ['src/**/*.test.js'],

        env: {
            type: 'node',
            runner: 'node',
            params: {
                runner: '--harmony'
            }
        },

        testFramework: 'jest',

        delays: {
            run: 1000
        },
        
    };
};
