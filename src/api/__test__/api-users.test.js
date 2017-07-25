import Glue from 'glue'; 
import path from 'path';
import R from 'ramda';
import { query, getClient } from '../../pg';
import manifest from '../../config/manifest'; 

const relativeTo = path.join(__dirname, '../../');
const dummyUserSql = 'INSERT INTO users (usr_firstname , usr_lastname, usr_email) VALUES ( $1, $2, $3 ) RETURNING *';

describe('API',() => {
    let Server;
    beforeAll(async (done) => {
        Glue.compose(manifest, { relativeTo }, (err, server) => {
            if (err) {
                console.log('server.register err:', err);
            }
            server.start(() => {
                console.log('✅  Server is listening on ' + server.info.uri.toLowerCase());
                Server = server;
                done();
            });
        });
    });

    afterAll(async (done) => {
        await Server.stop();
        done();
    });

    describe("Users", async () => {
        let user;
        beforeAll(async (done) => {
            user = await query(dummyUserSql,['Mister', 'Smith', 'mister@smith.com']);
            user = R.head(user.rows);
            done();
        });

        afterAll(async (done) => {
            await query(`DELETE FROM users WHERE usr_id = ${user.usr_id}`);
            done();
        });

        describe('List', () => {
            it('RAW SQL Get user with id x', async () => {
                const result = [{
                    usr_id: user.usr_id,
                    usr_lastname: 'Smith',
                    usr_email: 'mister@smith.com',
                    usr_firstname: 'Mister',
                    usr_employment_start: null,
                    usr_employment_end: null 
                }];
                const res = await query('SELECT * FROM users WHERE usr_id = $1',[user.usr_id]);
                expect(res.rows).toEqual(result);
            });

            it('GET Api /api/users', async () => {
                //let uri = Server.lookup('UserList').path;
                const response  = await Server.inject({ method: 'GET', url: '/api/users', });
                expect(response.statusCode).toBe(200);
                expect(response.result).toBeArrayOfObjects();
            });

            it(`GET Api /api/users/{id}`, async () => {
                const result = [{
                    usr_id: user.usr_id,
                    usr_lastname: 'Smith',
                    usr_email: 'mister@smith.com',
                    usr_firstname: 'Mister',
                    usr_employment_start: null,
                    usr_employment_end: null 
                }];
                const response  = await Server.inject({ method: 'GET', url: `/api/users/${user.usr_id}`});
                expect(response.statusCode).toBe(200);
                expect(response.result).toEqual(R.head(result));
            });
            
            // Should move into a own test
            describe('Create pg connection', async () => {
                await it('test multiple querys on single connection', async () =>{
                    const result = [{
                        usr_id: user.usr_id,
                        usr_lastname: 'Smith',
                        usr_email: 'mister@smith.com',
                        usr_firstname: 'Mister',
                        usr_employment_start: null,
                        usr_employment_end: null 
                    }];
                    const client = await getClient();
                    const resultOne = await client.query('SELECT * FROM users WHERE usr_id = $1',[user.usr_id]);
                    const resultTwo = await client.query('SELECT * FROM users WHERE usr_id = $1',[user.usr_id]);
                    client.release();
                    expect(resultOne.rows).toEqual(result);
                    expect(resultTwo.rows).toEqual(result);
                });
            });

            it(`Methods POST `, async () => {
                const POST = await Server.inject({ method: 'POST', url: `/api/users/${user.usr_id}`});
                expect(POST.statusCode).toBe(405);
            });

            it(`Methods PUT `, async () => {
                const PUT = await Server.inject({ method: 'PUT', url: `/api/users/${user.usr_id}`});
                expect(PUT.statusCode).toBe(405);
            });

            it(`Methods DELETE`, async () => {
                const DELETEmethod = await Server.inject({ method: 'DELETE', url: `/api/users/${user.usr_id}`});
                expect(DELETEmethod.statusCode).toBe(405);
            });

            it(`Methods PATCH`, async () => {
                const DELETEmethod = await Server.inject({ method: 'PATCH', url: `/api/users/${user.usr_id}`});
                expect(DELETEmethod.statusCode).toBe(405);
            });

        });
    });
});