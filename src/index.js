const errors = require('feathers-errors');

const deepDiffMapper = function() { // by sbgoran
  return {
    VALUE_CREATED: 'created',
    VALUE_UPDATED: 'updated',
    VALUE_DELETED: 'deleted',
    VALUE_UNCHANGED: 'unchanged',
    map: function(obj1, obj2) {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw 'Invalid argument. Function given, object expected.';
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        return {
          type: this.compareValues(obj1, obj2),
          data: (obj2 === undefined) ? obj1 : obj2
        };
      }

      var diff = {};
      for (var key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }

        var value2 = undefined;
        if ('undefined' != typeof(obj2[key])) {
          value2 = obj2[key];
        }

        diff[key] = this.map(obj1[key], value2);
      }
      for (var key in obj2) {
        if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
          continue;
        }

        diff[key] = this.map(undefined, obj2[key]);
      }

      return diff;
    },
    compareValues: function(value1, value2) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED;
      }
      if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
		    return this.VALUE_UNCHANGED;
      }
      if ('undefined' == typeof(value1)) {
        return this.VALUE_CREATED;
      }
      if ('undefined' == typeof(value2)) {
        return this.VALUE_DELETED;
      }

      return this.VALUE_UPDATED;
    },
    isFunction: function(obj) {
      return {}.toString.apply(obj) === '[object Function]';
    },
    isArray: function(obj) {
      return {}.toString.apply(obj) === '[object Array]';
    },
    isObject: function(obj) {
      return {}.toString.apply(obj) === '[object Object]';
    },
    isDate: function(obj) {
      return {}.toString.apply(obj) === '[object Date]';
    },
    isValue: function(obj) {
      return !this.isObject(obj) && !this.isArray(obj);
    }
  }
}();

module.exports = (options = {}) => {
  return function (hook) {
    if (hook.params.noLogging === true) return Promise.resolve(hook);

    //save snapshot
    if (hook.type === "before" && (hook.method === "patch" || hook.method === "update" || hook.method === "remove")) {
      return hook.service.get(hook.id, {noLogging: true})
      .then(res => {
        hook.params.snapshot = res;
        return hook;
      })
    } else if (hook.type === "before") {
      hook.params.snapshot = {};
      return Promise.resolve(hook);
    }

    //compare snapshot
    if (hook.type === "before") return Promise.resolve(hook);
    if (!options.service) return Promise.reject(new errors.GeneralError(new Error('Set `service` at elastic-logger hook')));
    let snapshot = hook.params.snapshot;
    let changed = hook.result ? (hook.result.data || hook.result) : {}
    if (hook.method === "remove") {changed = {}};
    let result = deepDiffMapper.map(snapshot, changed);
    return hook.app.service(options.service).create({
      path: hook.path,
      method: hook.method,
      type: hook.type,
      params: hook.params,
      id: hook.id,
      data: result,
      error: hook.error,
      timestamp: new Date()
    }, {noLogging: true})
    .then(res=>hook)
  }
}
