'use strict';

define(['app/vobjects/js', 'lodash'], function (JS, _) {
  describe('js', function () {
    it('should run script', function () {
      var script = new JS({ id: 0 }, '[42]');
      var result = script.generate(null, null, null);
      expect(_.isEqual(result, [42])).toEqual(true);
    });
  });
});
//# sourceMappingURL=js_test.js.map
