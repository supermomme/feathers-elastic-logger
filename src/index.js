const errors = require('feathers-errors');

module.exports = (options = {}) => {
  return function (hook) {
    if (hook.params.noLogging === true) return Promise.resolve(hook);
    if (hook.type === "before") return Promise.reject(new errors.GeneralError(new Error('Set elastic-logger hook as after and error hook')));
    if (!options.service) return Promise.reject(new errors.GeneralError(new Error('Set `service` at elastic-logger hook')));
    return hook.app.service(options.service).create({
      path: hook.path,
      method: hook.method,
      type: hook.type,
      params: hook.params,
      id: hook.id,
      error: hook.error,
      timestamp: new Date()
    }, {noLogging: true})
    .then(res=>hook)
  }
}
