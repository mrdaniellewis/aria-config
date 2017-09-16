const expect = require('expect');
const attributes = require('../attributes.json');

describe('attributes.json', () => {
  it('is an object', () => {
    expect(attributes.constructor).toEqual(Object);
  });

  Object.entries(attributes).forEach(([name, attribute]) => {
    const allowedKeys = ['type', 'value', 'tokens', 'default', 'deprecated', 'alone', 'global'];

    describe(name, () => {
      it('has only the expected keys', () => {
        Object.keys(attribute).forEach(key => expect(key).toBeOneOf(allowedKeys));
      });

      describe('type', () => {
        it('is specified for all attributes', () => {
          expect(attribute.type).toBeOneOf(['state', 'property']);
        });
      });

      describe('value', () => {
        const allowedValues = ['true/false', 'true/false/undefined', 'tristate', 'id', 'idlist', 'token', 'tokenlist', 'string', 'integer', 'number'];

        it('is specified for all attributes', () => {
          expect(attribute.value).toBeOneOf(allowedValues);
        });

        if (attribute.value === 'true/false') {
          it('contains a tokens of true and false', () => {
            expect(attribute.tokens).toEqual(['false', 'true']);
          });

          it('does not contain an alone key', () => {
            expect(attribute.alone).toEqual(undefined);
          });

          it('has a default of false', () => {
            expect(attribute.default).toEqual('false');
          });
        } else if (attribute.value === 'true/false/undefined') {
          it('contains a tokens of true, false, undefined', () => {
            expect(attribute.tokens).toEqual(['false', 'true', 'undefined']);
          });

          it('does not contain an alone key', () => {
            expect(attribute.alone).toEqual(undefined);
          });

          it('has a default of undefined', () => {
            expect(attribute.default).toEqual('undefined');
          });
        } else if (attribute.value === 'tristate') {
          it('contains a tokens of true, false, mixed, undefined', () => {
            expect(attribute.tokens).toEqual(['false', 'mixed', 'true', 'undefined']);
          });

          it('does not contain an alone key', () => {
            expect(attribute.alone).toEqual(undefined);
          });

          it('has a default of undefined', () => {
            expect(attribute.default).toEqual('undefined');
          });
        } else if (attribute.value === 'tokens') {
          it('has a tokens value that is an array', () => {
            expect(attribute.tokens).toBeAn(Array);
          });

          it('does not contain an alone key', () => {
            expect(attribute.alone).toEqual(undefined);
          });

          it('has a default key that is contained with the list of tokens ', () => {
            expect(attribute.default).toBeOneOf(attribute.tokens);
          });
        } else if (attribute.value === 'tokenlist') {
          it('has a tokens value that is an array', () => {
            expect(attribute.tokens).toBeAn(Array);
          });

          it('has an alone key contained within the list of tokens', () => {
            expect(attribute.alone).toBeOneOf(attribute.tokens);
          });

          it('has a default key that is contained with the list of tokens ', () => {
            attribute.default.split(' ').forEach((token, _, array) => {
              expect(token).toBeOneOf(attribute.tokens);
              if (array.length > 1) {
                expect(token).toNotEqual(attribute.alone);
              }
            });
          });
        } else if (['id', 'idlist', 'number', 'integer'].includes(attribute.value)) {
          it('does not contain a token key', () => {
            expect(attribute.token).toEqual(undefined);
          });

          it('does not contain an alone key', () => {
            expect(attribute.alone).toEqual(undefined);
          });

          it('does not contain a default key', () => {
            expect(attribute.default).toEqual(undefined);
          });
        }
      });

      it('has a global key of true or undefined', () => {
        expect(attribute.global).toBeOneOf([true, undefined]);
      });

      it('has a deprecated key of true or undefined', () => {
        expect(attribute.deprecated).toBeOneOf([true, undefined]);
      });
    });
  });
});
