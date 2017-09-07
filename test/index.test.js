import { expect } from 'chai';
import plugin from '../src';
const feathers = require('feathers');
const memory = require('feathers-memory');
const hooks = require('feathers-hooks');

describe('feathers-elastic-logger', () => {

  before(function() {
    this.app = feathers();
    this.app.configure(hooks())
    this.app.use('/logger', memory({
      paginate: {
        default: 2,
        max: 4
      }
    }));

    this.app.use('/messages', memory({
      paginate: {
        default: 2,
        max: 4
      }
    }));
    this.app.hooks({
      after: plugin({ service: 'logger' } ),
      error: plugin({ service: 'logger' } )
    })
  });

  it('is CommonJS compatible', () => {
    expect(typeof require('../lib')).to.equal('function');
  });

  it('should resolve on noLogging', function() {
    return this.app.service('messages').create({ foo:'baa', baa:'baa' }, { noLogging: true })
    .then(()=>this.app.service('logger').find({ noLogging: true }))
    .then(res=>{
      expect(res.total).to.equal(0, "should be empty service");
    })
    .then(()=>this.app.service('messages').remove(0, { noLogging: true }))
  });

  it('should log', function() {
    return this.app.service('messages').create({ foo:'baa', baa:'foo' })
    .then(()=>this.app.service('logger').find({
      noLogging: true,
      query: {
        $limit: 1,
        $sort: {
          timestamp: -1
        }
      }
    }))
    .then(res=>{
      expect(res.data[0].path).to.equal('messages', "path should be `messages`")
      expect(res.data[0].method).to.equal('create', "method should be `create`")
      expect(res.data[0].type).to.equal('after', "type should be `after`")
    })
  });

});
