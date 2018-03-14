# Api Boilerplate Server
## Working
### Makefile
Our setups always include a `Makefile` which helps with the setup. Needs Docker!

To see all possible targets just enter `make` to your cli.

Targets:
* `up`: Starts the whole development stack
* `start`: Start the stack in detached mode
* `rm`: remove the development stack

* `yarn`: to call yarn commands in the running development stack like for example `make yarn test` to run the tests.
* `shell`: get a shell within the server container

### Development
Just call `make up` and it will start the node server in development mode and a postgres database instance with some basic database setup.

The node server will expose port `8000` and `8001` while postgres will expose `5432` for development purposes.

### Testing

To test the server code you need a running development environment, therefor you need to call `make up` prior to the tests.

Then just calling `make yarn test` will run the tests using yarn in the server container.


## Documentation
### API
The hapi server uses the swagger plugin to show the rest api documentation.

You can access it while the server is running using `http://localhost:8000/docs`.

## Contributors

Since because of security concerns we needed to purge the git commit history, here are the contributors of the project.

* Phillip Bisson <pb@25th-floor.com>
* Andreas de Pretis <ad@25th-floor.com>
* Thomas Subera <thomas.subera@gmail.com>

## History

This  project was forked from https://github.com/25th-floor/ttrack-server