/**
 * Task 1 — Unique Array
 */

/**
 * Given some array, only return elements in an array that are unique by a given property name.
 * The order of the elements returned is the same as the given input. The uniqueness should be checked with strict
 * equality (no type coercion).
 *
 * Example with property name 'foo':
 *    Given:   [{foo: 'bar'}, {foo: 'bar'}, {foo: 'baz'}, {fom: 'bar'}, {fob: 'bar'}]
 *    Returns: [{foo: 'bar'}, {foo: 'baz'}, {fom: 'bar'}]
 *
 * @param {T[]} elements
 * @param {keyof T} property
 * @return {T[]} new array unique by property
 */
function uniqueBy(elements, property) {
    return elements.filter((item, i, itemArray) => itemArray.findIndex(targetItem => (targetItem[property] === item[property])) === i);
}
