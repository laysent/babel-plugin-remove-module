import * as paramTypes from 'param-types';
import React from 'react';

/**
 * const validation = paramTypes.validate(
 *   'name',
 *   paramTypes.shape({
 *     name: paramTypes.string.isRequired,
 *     age: paramTypes.number,
 *   }).isRequired,
 *   paramTypes.restOf(paramTypes.number)
 * );
 */


function test(person, id) {
  /* validation(person, id); */


  console.log(person, id);
  return;
}

test({ name: 'Andy' }, 1);
