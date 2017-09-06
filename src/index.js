const errors = require('feathers-errors');

module.exports = (options) => {
  return function (hook) {
    if (hook.type === "before" && (hook.method === "create" || hook.method === "patch" || hook.method === "update")) {
      hook.params.snapshot = hook.data;
      return Promise.resolve(hook);
    }
    if (hook.type === "before") return Promise.resolve(hook);
    if (!options.service) return Promise.reject(new errors.GeneralError(new Error('Set `service` at elastic-logger hook')));
    if (hook.params.noLogging === true) return Promise.resolve(hook);
    hook.app.service(options.service).create({
      path: hook.path,
      method: hook.method,
      type: hook.type,
      params: hook.params,
      id: hook.id,
      error: hook.error,
      timestamp: new Date()
    }, {noLogging: true})
    return Promise.resolve(hook);
  }
}
//TODO: get changes
//TODO: bee-queue
