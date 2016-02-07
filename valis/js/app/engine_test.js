'use strict';

define(['app/vobjects/vobject', 'app/engine', 'app/vobjects/time', 'app/vobjects/recorder', 'app/vobjects/cycle', 'app/vobjects/dac', 'app/vobject_factory', 'lodash'], function (vobject, engine, Time, Recorder, Cycle, DAC, VObjectFactory, _) {
  var printObject = function printObject(obj) {
    return JSON.stringify(obj, function (k, v) {
      if (v === undefined) {
        return '(undefined)';
      }

      return v;
    });
  };
  beforeEach(function () {
    jasmine.addMatchers({
      toDeepEqual: function toDeepEqual(util, customEqualityTesters) {
        return {
          compare: function compare(actual, expected) {
            return {
              pass: _.isEqual(actual, expected),
              message: 'Expected ' + printObject(actual) + ' to equal ' + ('' + printObject(expected))
            };
          }
        };
      }
    });
  });
  var vobjectFactory = new VObjectFactory(0);
  describe('VObjectGraph', function () {
    describe('addVobject', function () {
      it('should add an empty entry in .dedges', function () {
        var graph = new engine.VObjectGraph();
        var obj1 = vobjectFactory.create('log');
        graph.addVobject(obj1);
        expect(graph.dedges[obj1.id]).toEqual({});
      });

      it('should initially register the object as a leaf', function () {
        var graph = new engine.VObjectGraph();
        var obj = vobjectFactory.create('log');
        graph.addVobject(obj);
        expect(graph.leaves[obj.id]).toBe(obj);
      });
    });

    describe('removeVobject', function () {
      it('should remove the corresponding vobject from leaves', function () {
        var graph = new engine.VObjectGraph();
        var obj = vobjectFactory.create('log');
        graph.addVobject(obj);
        expect(graph.leaves[obj.id]).toBe(obj);
        graph.removeVobject(obj);
        expect(graph.leaves[obj.id]).toBe(undefined);
      });

      it('should remove any dedges coming from the vobject', function () {
        var graph = new engine.VObjectGraph();
        var obj1 = vobjectFactory.create('log');
        var obj2 = vobjectFactory.create('log');
        graph.addVobject(obj1);
        graph.addVobject(obj2);
        graph.addDedge(obj1, 3, obj2, 1);
        graph.removeVobject(obj1);
        expect(graph.dedges[obj1.id]).toBe(undefined);
      });

      it('should remove any dedges going to the vobject', function () {
        var graph = new engine.VObjectGraph();
        var obj1 = vobjectFactory.create('log');
        var obj2 = vobjectFactory.create('log');
        graph.addVobject(obj1);
        graph.addVobject(obj2);
        graph.addDedge(obj1, 3, obj2, 1);
        expect(graph.dedges[obj1.id]).not.toEqual({});
        graph.removeVobject(obj2);
        expect(graph.dedges[obj1.id]).toEqual(undefined);
      });
    });

    describe('addDedge', function () {
      it('should register a new dedge', function () {
        var graph = new engine.VObjectGraph();
        var obj1 = vobjectFactory.create('log');
        var obj2 = vobjectFactory.create('log');
        graph.addVobject(obj1);
        graph.addVobject(obj2);
        graph.addDedge(obj1, 3, obj2, 1);
        var edges = graph.dedges[obj1.id];
        var fromEdge3 = edges[3];
        var edge = fromEdge3[0];
        expect(edge.from.id).toBe(obj1.id);
        expect(edge.to.id).toBe(obj2.id);
        expect(edge.fromOutput).toBe(3);
        expect(edge.toInput).toBe(1);
      });

      it('should remove the from vobject from leaves', function () {
        var graph = new engine.VObjectGraph();
        var obj1 = vobjectFactory.create('log');
        var obj2 = vobjectFactory.create('log');
        graph.addVobject(obj1);
        graph.addVobject(obj2);
        expect(graph.leaves[obj1.id]).toBe(obj1);
        graph.addDedge(obj1, 3, obj2, 1);
        expect(graph.leaves[obj1.id]).toBe(undefined);
      });
    });
  });

  describe('removeDedge', function () {
    it('should add the from vobject back to leaves if its the last output', function () {
      var graph = new engine.VObjectGraph();
      var obj1 = vobjectFactory.create('log');
      var obj2 = vobjectFactory.create('log');
      graph.addVobject(obj1);
      graph.addVobject(obj2);
      graph.addDedge(obj1, 3, obj2, 1);
      expect(graph.leaves[obj2.id]).toBe(obj2);
      expect(graph.leaves[obj1.id]).toBe(undefined);
      graph.removeDedge(obj1, 3, obj2, 1);
      expect(graph.leaves[obj1.id]).toBe(obj1);
    });

    it('should remove the dedge from this.dedges', function () {
      var graph = new engine.VObjectGraph();
      var obj1 = vobjectFactory.create('log');
      var obj2 = vobjectFactory.create('log');
      graph.addVobject(obj1);
      graph.addVobject(obj2);
      graph.addDedge(obj1, 3, obj2, 1);
      expect(graph.dedges[obj1.id][3][0].to).toBe(obj2);
      graph.removeDedge(obj1, 3, obj2, 1);
      expect(graph.dedges[obj1.id][3]).toBe(undefined);
    });
  });

  describe('AudioProcess', function () {
    var createAudioProcess = function createAudioProcess() {
      var sampleTime = 0;
      var sampleRate = 0;
      var graph = new engine.VObjectGraph();
      return new engine.AudioProcess(sampleTime, sampleRate, null, null, graph, null);
    };

    it('should run a simple graph of two nodes, one source one sink', function () {
      var ap = createAudioProcess();
      var sampletime = new Time({ id: 0 });
      // use a recorder to check the data comes through
      var recorder = new Recorder({ id: 1 });
      ap.graph.addVobject(sampletime);
      ap.graph.addVobject(recorder);
      ap.graph.addDedge(sampletime, 0, recorder, 0);
      ap.run();
      expect(recorder.record).toDeepEqual({ 0: { 0: '0' } });
    });

    it('should run a simple graph of two nodes, both leaves', function () {
      var ap = createAudioProcess();
      var recorder1 = new Recorder({ id: 0 });
      var recorder2 = new Recorder({ id: 1 });
      ap.graph.addVobject(recorder1);
      ap.graph.addVobject(recorder2);
      ap.run();
      expect(recorder1.record).toDeepEqual({ 0: {} });
      expect(recorder2.record).toDeepEqual({ 0: {} });
    });

    it('should run a graph of two nodes input to one', function () {
      var ap = createAudioProcess();
      var recorder = new Recorder({ id: 0 });
      var sampletime1 = new Time({ id: 1 });
      var sampletime2 = new Time({ id: 2 });
      ap.graph.addVobject(recorder);
      ap.graph.addVobject(sampletime1);
      ap.graph.addVobject(sampletime2);
      ap.graph.addDedge(sampletime1, 0, recorder, 0);
      ap.graph.addDedge(sampletime2, 0, recorder, 1);
      ap.run();
      expect(recorder.record).toDeepEqual({ 0: { 0: '0', 1: '0' } });
    });

    it('should run a graph of two nodes input to one', function () {
      var ap = createAudioProcess();
      var recorder = new Recorder({ id: 0 });
      var sampletime1 = new Time({ id: 1 });
      var sampletime2 = new Time({ id: 2 });
      ap.graph.addVobject(recorder);
      ap.graph.addVobject(sampletime1);
      ap.graph.addVobject(sampletime2);
      ap.graph.addDedge(sampletime1, 0, recorder, 0);
      ap.graph.addDedge(sampletime2, 0, recorder, 1);
      ap.run();
      expect(recorder.record).toDeepEqual({ 0: { 0: '0', 1: '0' } });
    });

    it('should run a graph where an output is connected to two inputs', function () {
      var ap = createAudioProcess();
      var recorder = new Recorder({ id: 0 });
      var sampletime = new Time({ id: 1 });
      ap.graph.addVobject(recorder);
      ap.graph.addVobject(sampletime);
      ap.graph.addDedge(sampletime, 0, recorder, 0);
      ap.graph.addDedge(sampletime, 0, recorder, 1);
      ap.run();
      expect(recorder.record).toDeepEqual({ 0: { 0: '0', 1: '0' } });
    });

    it('should run a graph where an output is connected to two inputs', function () {
      var ap = createAudioProcess();
      var recorder = new Recorder({ id: 0 });
      var sampletime = new Time({ id: 1 });
      ap.graph.addVobject(recorder);
      ap.graph.addVobject(sampletime);
      ap.graph.addDedge(sampletime, 0, recorder, 0);
      ap.graph.addDedge(sampletime, 0, recorder, 1);
      ap.run();
      expect(recorder.record).toDeepEqual({ 0: { 0: '0', 1: '0' } });
    });
  });

  /* this is a neat integration test, but it causes an annoying beep :D
  describe('Engine', function() {
    it('should put data to the DAC', function() {
      const theEngine = new engine.Engine();
      const cycle = new Cycle();
      const dac = new DAC();
       theEngine.graph.addVobject(cycle);
      theEngine.graph.addVobject(dac);
       // stereo
      theEngine.graph.addDedge(cycle, 0, dac, 0);
      theEngine.graph.addDedge(cycle, 0, dac, 1);
       theEngine.start();
       window.setTimeout(function() {
        theEngine.stop();
      }, 1000);
    });
  }); */
});
//# sourceMappingURL=engine_test.js.map
