# feathers-elastic-logger
## It's not finished!
[![Build Status](https://travis-ci.org/supermomme/feathers-elastic-logger.svg?branch=master)](https://travis-ci.org/supermomme/feathers-elastic-logger)
[![Code Climate](https://codeclimate.com/github/supermomme/feathers-elastic-logger/badges/gpa.svg)](https://codeclimate.com/github/supermomme/feathers-elastic-logger)
[![Test Coverage](https://codeclimate.com/github/supermomme/feathers-elastic-logger/badges/coverage.svg)](https://codeclimate.com/github/supermomme/feathers-elastic-logger/coverage)
[![Dependency Status](https://img.shields.io/david/supermomme/feathers-elastic-logger.svg?style=flat-square)](https://david-dm.org/supermomme/feathers-elastic-logger)
[![Download Status](https://img.shields.io/npm/dm/feathers-elastic-logger.svg?style=flat-square)](https://www.npmjs.com/package/feathers-elastic-logger)

>

## Installation

```
npm install feathers-elastic-logger --save
```

## Documentation

Please refer to the [feathers-elastic-logger documentation](http://docs.feathersjs.com/) for more details.

## Complete Example

Here's an example of a Feathers server that uses `feathers-elastic-logger`.

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const plugin = require('feathers-elastic-logger');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Initialize your feathers plugin
  .use('/plugin', plugin())
  .use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
```

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
