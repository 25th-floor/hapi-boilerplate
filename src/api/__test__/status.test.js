const appRoot = require('app-root-path');
const { startServer } = require(`${appRoot}/src/startServer`);
let Server;

const testApiEndpoint = () => `/api`;

describe('API',() => {
    beforeAll(async () => {
        try {
            Server = await startServer();
        } catch (error) {
            console.error(error);
        }
    });

    afterAll(async () => {
        Server.log('try stop server');
        await Server.stop();
        Server.log('server Stopped');
    }); 

    it('should return the api version',async () => {
        const {statusCode,result}  = await Server.inject({ method: 'GET', payload:{} , url: testApiEndpoint() });
        expect(statusCode).toBe(200);
        expect(result).toEqual({
            "apiVersion": 1,
            "validVersions": [1],
            "version": "0.1.0"
        });
    });
}); 
