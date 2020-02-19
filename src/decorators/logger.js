const util = require('util');

export function logger(target, name, descriptor) {
  let fn = descriptor.value;

  const logFunction = async function() {
    const req = arguments[0];
    const next = arguments[2];

    let startTime = process.hrtime();

    try {
      await fn.apply(target, arguments);
    } catch (e) {
      e.message = `Method ${name} - ${e.message} - ${util.inspect(req.query)} - ${util.inspect(req.body)}`;
      next(e);
    }

    let diff = process.hrtime(startTime);
    console.log(`Method ${name} took ${diff[0] * 1e9 + diff[1]} nanoseconds`);
  };

  descriptor.value = logFunction;
  return descriptor;
}
