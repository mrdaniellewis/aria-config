const expect = require('expect');

expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    return {
      message: () => `expected ${received} ${this.isNot ? 'not ' : ''}to be one of ${expected}`,
      pass,
    };
  },

  toBeAnArrayOrUndefined(received) {
    const pass = received === undefined || Array.isArray(received);
    return {
      message: () => `expected ${received} ${this.isNot ? 'not ' : ''}to be an array or undefined`,
      pass,
    };
  },

  toBeAHashOrUndefined(received) {
    const pass = received === undefined || received.constructor === Object;
    return {
      message: () => `expected ${received} ${this.isNot ? 'not ' : ''}to be a hash or undefined`,
      pass,
    };
  },

  toBeAnInteger(received) {
    const integer = parseInt(received, 10);
    const pass = !Number.isNaN(integer) && received === integer;
    return {
      message: () => `expected ${received} ${this.isNot ? 'not ' : ''}to be an integer`,
      pass,
    };
  },

  toHaveProperty(object, property) {
    const pass = property in object;
    return {
      message: () => `expected ${property} ${this.isNot ? 'not ' : ''}to be one of ${Object.keys(object)}`,
      pass,
    };
  },
});
