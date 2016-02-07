'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

define(['app/patch_model', 'app/vobjects/cycle', 'lodash'], function (PatchModel, Cycle, _) {
  describe('PatchModel', function () {
    it('should toJSON with a vobject in it', function () {
      var patchModel = new PatchModel();
      var graph = patchModel.graph;
      var cycle = new Cycle({ id: 0 });
      graph.addVobject(cycle);
      var json = patchModel.toJSON();
      expect(json).toDeepEqual({
        dedges: [],
        vobjects: _defineProperty({}, cycle.id, {
          vobjectClass: 'oscillator',
          args: [cycle.frequency]
        }),
        vobjectPositions: {},
        nextVobjectId: 0
      });
    });
  });
});
//# sourceMappingURL=patch_model_test.js.map
