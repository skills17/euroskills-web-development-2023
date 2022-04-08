describe('replaceStr', () => {
    it('replaces words', () => {
        expect(replaceStr('Lorem Ipsum Dolor')).to.equal('Lorem Ipsum Dolor');
        expect(replaceStr('Hello, World!', ['Hello', 'Hey'], ['World', 'Universe'])).to.equal('Hey, Universe!');
        expect(replaceStr('Hello, World!', ['Hello', 'Hey'], ['Hey', 'Hi'])).to.equal('Hi, World!');
    });
});
