describe('Extra', () => {
    describe('uniqueBy', () => {
        it('Given empty array, returns empty array', () => {
            expectEqualMemberWithOrder(uniqueBy([], 'FLOPHSBCJE'), []);
        });

        it('Unique by existing property', () => {
            const a_elem1 = {WXXIHRIWQR: 'SMZVJLPEMR'};
            const a_elem2 = {WXXIHRIWQR: 'GKYWGDXJJL'};
            const a_elem3 = {WXXIHRIWQR: 'SMZVJLPEMR'};
            expectEqualMemberWithOrder(uniqueBy([a_elem1, a_elem2, a_elem3], 'WXXIHRIWQR'), [a_elem1, a_elem2]);
            const b_elem1 = {WXXIHRIWQR: 'DIWOPZBGAC'};
            const b_elem2 = {WXXIHRIWQR: 'KZZYLRIDNC'};
            const b_elem3 = {WXXIHRIWQR: 'YOUAGVHCFL'};
            const b_elem4 = {WXXIHRIWQR: 'OCCQXHGCZE'};
            const b_elem5 = {WXXIHRIWQR: 'DIWOPZBGAC'};
            expectEqualMemberWithOrder(uniqueBy([b_elem1, b_elem2, b_elem3, b_elem4, b_elem5], 'WXXIHRIWQR'), [b_elem1, b_elem2, b_elem3, b_elem4]);
        });

        it('Unique by missing property', () => {
            const elem1 = {MTKXWRNGSL: 'GRBMXNKYRT'};
            const elem2 = {MTKXWRNGSL: 'NOCFQVQGUO'};
            const elem3 = {MTKXWRNGSL: 'HMAIFXCQOR'};
            expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3], 'GRBMXNKYRT'), [elem1]);
        });

        it('Unique by partially missing property', () => {
            const elem1 = {};
            const elem2 = {XSPYFYJGUZ: 'bar'};
            const elem3 = {fom: 'bar'};
            const elem4 = {fob: 'bar'};
            const elem5 = {XSPYFYJGUZ: 'baz'};
            expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3, elem4, elem5], 'XSPYFYJGUZ'), [elem1, elem2, elem5]);
        });

        it('Unique by property but values are not strictly equal', () => {
            const elem1 = {foo: {}};
            const elem2 = {foo: {}};
            const elem3 = {foo: 1};
            expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3], 'foo'), [elem1, elem2, elem3]);
        });

        it('Unique by symbol', () => {
            const symbol = Symbol('LELXIXSCGG');
            const elem1 = {[symbol]: 'foo'}
            const elem2 = {[symbol]: 'bar'}
            const elem3 = {symbol: 'foo'}
            const elem4 = {[symbol]: 'foo'}
            const elem5 = {[symbol]: 'foo'}
            const elem6 = {[symbol]: 'baz'}
            expectEqualMemberWithOrder(uniqueBy([elem1, elem2, elem3, elem4, elem5, elem6], symbol), [elem1, elem2, elem3, elem6])
        });

    });

    function expectEqualMemberWithOrder(expected, actual) {
        expect(expected.length).to.equal(actual.length, 'expected array length');
        for (let i = 0; i <= expected.length; i++) {
            expect(expected[i]).to.equal(actual[i], `expected element at index ${i} to be strictly equal`);
        }
    }
});
