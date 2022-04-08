describe('Extra', () => {
  describe('replaceStr', () => {
      it('replaces words', () => {
          expect(replaceStr('Lorem Ipsum Dolor', ['lorem', 'Foo'])).to.equal('Lorem Ipsum Dolor');
          expect(replaceStr('Lorem Ipsum Dolor', ['Lorem', 'Foo'])).to.equal('Foo Ipsum Dolor');
          expect(replaceStr('Lorem Ipsum Dolor', ['Lorem', 'Foo'], ['Lorem', 'Bar'])).to.equal('Foo Ipsum Dolor');
          expect(replaceStr('Lorem Ipsum Dolor', ['Lorem', 'Foo'], ['Foo', 'Bar'])).to.equal('Bar Ipsum Dolor');
      });
  });
});
