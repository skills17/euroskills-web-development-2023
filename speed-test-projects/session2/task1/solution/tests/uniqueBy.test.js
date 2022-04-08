describe('uniqueBy', () => {
    it('Given empty array, returns empty array', () => {
        expectEqualMemberWithOrder(uniqueBy([], 'foo'), []);
    });

    it('Unique by existing property', () => {
        const elem1 = {foo: 'bar'};
        const elem2 = {foo: 'bar'};
        const elem3 = {foo: 'baz'};
        expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3], 'foo'), [elem1, elem3]);
    });

    it('Unique by missing property', () => {
        const elem1 = {foo: 'bar'};
        const elem2 = {foo: 'bar'};
        const elem3 = {foo: 'baz'};
        expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3], 'bar'), [elem1]);
    });

    it('Unique by partially missing property', () => {
        const elem1 = {};
        const elem2 = {foo: 'bar'};
        const elem3 = {foo: 'baz'};
        const elem4 = {fom: 'bar'};
        const elem5 = {fob: 'bar'};
        expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3, elem4, elem5], 'foo'), [elem1, elem2, elem3]);
    });

    it('Unique by property but values are not strictly equal', () => {
        const elem1 = {foo: '1'};
        const elem2 = {foo: 1};
        const elem3 = {foo: 0.1e1};
        const elem4 = {foo: 2};
        expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3, elem4], 'foo'), [elem1, elem2, elem4]);
    });

    it('Unique by symbol', () => {
        const symbol = Symbol('foo');
        const elem1 = {[symbol]: 'foo'}
        const elem2 = {[symbol]: 'bar'}
        const elem3 = {symbol: 'foo'}
        const elem4 = {[symbol]: 'foo'}
        expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3, elem4], symbol), [elem1, elem2, elem3])
    });

});

function expectEqualMemberWithOrder(expected, actual) {
    expect(expected.length).to.equal(actual.length, 'expected array length');
    for (let i = 0; i <= expected.length; i++) {
        expect(expected[i]).to.equal(actual[i], `expected element at index ${i} to be strictly equal`);
    }
}
