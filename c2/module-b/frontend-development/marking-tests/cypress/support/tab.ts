/*
DISCLAIMER!
This code is copy pasted from here:
https://github.com/getstreamline/menu/blob/master/cypress/support/index.js#L39
*/


const DISABLEABLE_ELEMENTS = ['input', 'button', 'select', 'textarea', 'button', 'object'];

/**
 * Determines if the given element is focusable.
 *
 * Note: this is a naive/simplified version adapted from jQuery UI. It does not support image maps,
 * disabled fieldsets, among other things.
 */
function isFocusable($element: JQuery) {
    const nodeName = $element.prop('nodeName').toLowerCase();
    return (
        nodeName === 'a' || !!$element.attr('tabindex') || (
            DISABLEABLE_ELEMENTS.includes(nodeName) && $element.is(':enabled')
        )
    ) && $element.is(':visible');
}

/**
 * Determines if the given element is focusable using Tab key navigation.
 *
 * Note: this is a naive/simplified version adapted from jQuery UI. It does not support image maps,
 * disabled fieldsets, among other things.
 */
function isTabbable($element: JQuery) {
    const tabIndex = $element.attr('tabindex');
    return (!tabIndex || parseInt(tabIndex, 10) >= 0) && isFocusable($element);
}

/**
 * Returns the next element that would received focus using Tab key navigation.
 *
 * Note: this uses a naive/simplified algorithm adapted from jQuery UI. It does not support image
 * maps, disabled fieldsets, among other things.
 */
export function nextTabbable($referenceElement: JQuery, direction: 'forward' | 'backward' = 'forward'): JQuery {
    if (!(direction === 'forward' || direction === 'backward')) {
        throw new Error('Expected direction to be forward or backward');
    }

    const stack = [];
    let element;

    // Queue up all siblings and our ancestor's siblings.
    const siblingProp = direction === 'forward' ? 'nextElementSibling' : 'previousElementSibling';
    element = $referenceElement.get(0);
    while (element) {
        let sibling = element[siblingProp];
        while (sibling) {
            stack.unshift(sibling);
            sibling = sibling[siblingProp];
        }
        element = element.parentElement;
    }

    // Find a tabbable element among our siblings using depth first search.
    while (stack.length > 0) {
        element = stack.pop();

        const $candidateElement = $referenceElement.constructor(element);
        if (isTabbable($candidateElement)) {
            return $candidateElement;
        }

        let children = Array.from(element!.children);
        if (direction === 'forward') {
            children = children.reverse();
        }
        children.forEach((child) => {
            stack.push(child);
        });
    }

    return $referenceElement.constructor();
}

export function simulateTabPress(direction: 'forward' | 'backward' = 'forward') {
    cy.focused()
        .then($el => nextTabbable($el, direction))
        .focus();
}
