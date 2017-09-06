const feathers = require('feathers');
const rest = require('feathers-rest');
const handler = require('feathers-errors/handler');
const bodyParser = require('body-parser');
const memory = require('feathers-memory');
const hooks = require('feathers-hooks');
const elasticsearch = require('elasticsearch');
const elasticService = require('feathers-elasticsearch');
const plugin = require('../lib');

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
  },
  id:'_id'
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

//Set plugin hooks
app.hooks({
  before: plugin({ service: 'logger' } ),
  after: plugin({ service: 'logger' } ),
  error: plugin({ service: 'logger' } )
})

// A basic error handler, just like Express
app.use(handler());


// Start the server
var server = app.listen(3030);
server.on('listening', function () {
  console.log('Feathers running on 127.0.0.1:3030');
});
