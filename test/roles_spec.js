const expect = require('expect');
const attributes = require('../attributes.json');
const roles = require('../roles.json');

function collectAttributes(role) {
  const roleAttributes = role.attributes || [];
  role.superclass.forEach(function collect(roleName) {
    if (roles[roleName].attributes) {
      roleAttributes.push(...roles[roleName].attributes);
    }
    roles[roleName].superclass.forEach(collect);
  });
  return roleAttributes;
}

function expectValueIsAllowed(attribute, value) {
  if (attribute.value === 'tokenlist') {
    value.split(' ').forEach((token) => {
      expect(token).toBeOneOf(attribute.tokens);
    });
  } else if (attribute.tokens) {
    expect(value).toBeOneOf(attribute.tokens);
  } else if (attribute.value === 'number') {
    expect(typeof value).toEqual('number');
  } else if (attribute.value === 'integer') {
    expect(value).toBeAnInteger();
  } else {
    throw new Error(`unknown value type ${attribute.value}`);
  }
}

describe('roles.json', () => {
  it('is an object', () => {
    expect(roles.constructor).toEqual(Object);
  });

  Object.entries(roles).forEach(([name, role]) => {
    describe(name, () => {
      const allowedKeys = ['abstract', 'superclass', 'requiredContextRole', 'requiredOwnedElements', 'attributes', 'nameFromAuthor', 'nameFromContents', 'accessibleNameRequired', 'childrenPresentational', 'implicitValues', 'defaultValues', 'requiredAttributes'];

      it('has only the expected keys', () => {
        Object.keys(role).forEach(key => expect(key).toBeOneOf(allowedKeys));
      });

      describe('abstract', () => {
        it('is either true or undefined', () => {
          expect(role.abstract).toBeOneOf([true, undefined]);
        });
      });

      describe('superclass', () => {
        it('is an array', () => {
          expect(role.superclass).toBeInstanceOf(Array);
        });

        it('contains valid roles', () => {
          role.superclass.forEach((klass) => {
            expect(roles).toHaveProperty(klass);
          });
        });
      });

      describe('requiredContextRole', () => {
        it('is undefined or an array', () => {
          expect(role.requiredContextRole).toBeAnArrayOrUndefined();
        });

        if (role.requiredContextRole) {
          it('contains valid roles', () => {
            role.requiredContextRole.forEach((contextRole) => {
              expect(roles).toHaveProperty(contextRole);
            });
          });
        }
      });

      describe('requiredOwnedElements', () => {
        it('is undefined or an array', () => {
          expect(role.requiredOwnedElements).toBeAnArrayOrUndefined();
        });

        if (role.requiredOwnedElements) {
          it('is an array of arrays', () => {
            role.requiredOwnedElements.forEach((item) => {
              expect(item).toBeInstanceOf(Array);
            });
          });

          it('contains valid roles', () => {
            role.requiredOwnedElements.forEach((item) => {
              item.forEach((owned) => {
                expect(roles).toHaveProperty(owned);
              });
            });
          });
        }
      });

      describe('attributes', () => {
        it('is an array or undefined', () => {
          expect(role.attributes).toBeAnArrayOrUndefined();
        });

        if (role.attributes) {
          it('contains known attributes', () => {
            role.attributes.forEach((attribute) => {
              expect(attributes).toHaveProperty(attribute);
            });
          });
        }

        if (name === 'roletype') {
          it('contains all global attributes', () => {
            const globalAttributes = Object.entries(attributes)
              .filter(([, attribute]) => attribute.global)
              .map(([global]) => global);

            expect(globalAttributes).toEqual(role.attributes);
          });
        }
      });

      describe('requiredAttributes', () => {
        it('is an array or undefined', () => {
          expect(role.requiredAttributes).toBeAnArrayOrUndefined();
        });

        if (role.requiredAttributes) {
          it('is made up of attributes that exist on the role', () => {
            const roleAttributes = collectAttributes(role);
            role.requiredAttributes.forEach((attributeName) => {
              expect(attributeName).toBeOneOf(roleAttributes);
            });
          });
        }
      });

      describe('implicitValues', () => {
        it('is a hash or undefined', () => {
          expect(role.implicitValues).toBeAHashOrUndefined();
        });

        if (role.implicitValues) {
          it('is made up of attributes that exist on the role', () => {
            const roleAttributes = collectAttributes(role);
            Object.keys(role.implicitValues).forEach((attributeName) => {
              expect(attributeName).toBeOneOf(roleAttributes);
            });
          });

          it('has valid values', () => {
            Object.entries(role.implicitValues).forEach(([attributeName, value]) => {
              expectValueIsAllowed(attributes[attributeName], value);
            });
          });
        }
      });

      describe('defaultValues', () => {
        it('is a hash or undefined', () => {
          expect(role.defaultValues).toBeAHashOrUndefined();
        });

        if (role.defaultValues) {
          it('is made up of attributes that exist on the role', () => {
            const roleAttributes = collectAttributes(role);
            Object.keys(role.defaultValues).forEach((attributeName) => {
              expect(attributeName).toBeOneOf(roleAttributes);
            });
          });

          it('has valid values', () => {
            Object.entries(role.defaultValues).forEach(([attributeName, value]) => {
              expectValueIsAllowed(attributes[attributeName], value);
            });
          });
        }
      });

      describe('nameFromContents', () => {
        it('is true or undefined', () => {
          expect(role.nameFromContents).toBeOneOf([true, undefined]);
        });
      });

      describe('nameFromAuthor', () => {
        it('is true or undefined', () => {
          expect(role.nameFromAuthor).toBeOneOf([true, undefined]);
        });
      });

      describe('accessibleNameRequired', () => {
        it('is true or undefined', () => {
          expect(role.accessibleNameRequired).toBeOneOf([true, undefined]);
        });
      });

      describe('childrenPresentational', () => {
        it('is true or undefined', () => {
          expect(role.childrenPresentational).toBeOneOf([true, undefined]);
        });
      });
    });
  });
});
