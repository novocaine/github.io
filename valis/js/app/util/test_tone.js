'use strict';

define(['app/engine', 'app/vobjects/cycle', 'app/vobjects/dac'], function (engine, vobjectsCycle, vobjectsDac) {
  var startTone = function startTone() {
    var e = new engine.Engine();
    var cycle1 = new vobjectsCycle.Cycle({ frequency: 880 });
    var cycle2 = new vobjectsCycle.Cycle({ frequency: 220 });
    var dac = new vobjectsDac.DAC();
    e.graph.addVobject(cycle1);
    e.graph.addDedge(cycle1, 0, dac, 0);
    e.graph.addVobject(cycle2);
    e.graph.addDedge(cycle2, 0, dac, 1);
    e.start();
  };

  return { startTone: startTone };
});
//# sourceMappingURL=test_tone.js.map
