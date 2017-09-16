const expect = require('expect');

expect.extend({
  toBeOneOf(values, message) {
    expect.assert(
      values.includes(this.actual),
      (message || `expected %s to be one of ${values}`),
      this.actual,
    );
    return this;
  },

  toBeAnArrayOrUndefined(message) {
    expect.assert(
      this.actual === undefined || Array.isArray(this.actual),
      (message || 'expected %s to be an array or undefined'),
      this.actual,
    );
    return this;
  },

  toBeAHashOrUndefined(message) {
    expect.assert(
      this.actual === undefined || this.actual.constructor === Object,
      (message || 'expected %s to be a hash or undefined'),
      this.actual,
    );
    return this;
  },

  toBeAnInteger(message) {
    const integer = parseInt(this.actual, 10);
    expect.assert(
      !Number.isNaN(integer) && this.actual === integer,
      (message || 'expected %s to be an integer'),
      this.actual,
    );
    return this;
  },
});
