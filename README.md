# feathers-elastic-logger
[![Build Status](https://travis-ci.org/supermomme/feathers-elastic-logger.svg?branch=master)](https://travis-ci.org/supermomme/feathers-elastic-logger)
[![Dependency Status](https://img.shields.io/david/supermomme/feathers-elastic-logger.svg?style=flat-square)](https://david-dm.org/supermomme/feathers-elastic-logger)
[![Download Status](https://img.shields.io/npm/dm/feathers-elastic-logger.svg?style=flat-square)](https://www.npmjs.com/package/feathers-elastic-logger) [![Greenkeeper badge](https://badges.greenkeeper.io/supermomme/feathers-elastic-logger.svg)](https://greenkeeper.io/)

## Why?

I use it to monitor information with elastic and kibana

## Installation

```
npm install feathers-elastic-logger --save
```

## Documentation

#### Hook
used as after and error hook in app

service is the elastic service name

it looks something like this

```js
app.hooks({
  after: elasticLogger({ service: 'logger' }),
  error: elasticLogger({ service: 'logger' })
})
```

#### No Logging

if you want a request unlogged, you can set noLogging to true like that

```js
someService.find({noLogging: true})
```

## Complete Example

Here's an example of a Feathers server that uses `feathers-elastic-logger`.

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const handler = require('feathers-errors/handler');
const bodyParser = require('body-parser');
const memory = require('feathers-memory');
const hooks = require('feathers-hooks');
const elasticsearch = require('elasticsearch');
const elasticService = require('feathers-elasticsearch');
const elasticLogger = require('feathers-elastic-logger');

// Create a feathers instance.
const app = feathers()
  .configure(hooks())
  .configure(rest())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}));

//Create memory service
app.use('/messages', memory({
  paginate: {
    default: 2,
    max: 4
  }
}));

//Create elastic service
app.use(`/logger`, elasticService({
  Model: new elasticsearch.Client({
    host: 'localhost:9200',
    apiVersion: '5.0'
  }),
  elasticsearch: {
    index: 'example',
    type: 'logs'
  }
}));

//Set elasticLogger hooks
app.hooks({
  after: elasticLogger({ service: 'logger' } ),
  error: elasticLogger({ service: 'logger' } )
})

// A basic error handler, just like Express
app.use(handler());


// Start the server
var server = app.listen(3030);
server.on('listening', function () {
  console.log('Feathers running on 127.0.0.1:3030');
});

```

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
