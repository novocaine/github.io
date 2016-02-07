'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['lodash'], function (_) {
  var AudioArrayType = Float32Array;

  var Engine = function () {
    function Engine() {
      _classCallCheck(this, Engine);

      this.graph = new VObjectGraph();
      this.bufferSize = 512;
      this.numChannels = 2;
    }

    _createClass(Engine, [{
      key: 'start',
      value: function start() {
        this.bufferPool = new BufferPool(this.bufferSize);
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.audioNode = this.context.createScriptProcessor(this.bufferSize, 0, this.numChannels);
        this.audioNode.onaudioprocess = _.bind(this.onaudioprocess, this);
        this.outputEdges = {};

        // if you dont do this, the callback stops getting fired after a while on
        // chrome .. yep .. wow .. such bug
        // https://code.google.com/p/chromium/issues/detail?id=82795
        window.onaudioprocess = this.audioNode.onaudioprocess;
        window.audioNode = this.audioNode;

        this.audioNode.connect(this.context.destination);
        this.running = true;

        this.prevOutputValues = {};
      }
    }, {
      key: 'stop',
      value: function stop() {
        if (this.audioNode) {
          this.audioNode.disconnect(this.context.destination);
        }
        this.running = false;
      }
    }, {
      key: 'onaudioprocess',
      value: function onaudioprocess(e) {
        var domTimestamp = window.performance ? window.performance.now() : null;
        var extOutputBuffers = [];
        for (var i = 0; i < e.outputBuffer.numberOfChannels; i++) {
          extOutputBuffers.push(e.outputBuffer.getChannelData(i));
        }

        // output buffers aren't necessarily zero when you get them from the system
        this.writeSilence(extOutputBuffers);

        var extInputBuffers = [];
        if (e.inputBuffer) {
          for (var i = 0; i < e.inputBuffer.numberOfChannels; i++) {
            extInputBuffers.push(e.inputBuffer.getChannelData(i));
          }
        }

        // time in samples since context init, is fractional (sigh)
        this.audioProcess = new AudioProcess(this.context.currentTime * this.context.sampleRate, this.context.sampleRate, extInputBuffers, extOutputBuffers, this.graph, this.bufferPool, domTimestamp, this.bufferSize);

        this.prevOutputValues = this.audioProcess.run(this.prevOutputValues);
      }
    }, {
      key: 'writeSilence',
      value: function writeSilence(extOutputBuffers) {
        for (var i = 0; i < extOutputBuffers.length; i++) {
          var data = extOutputBuffers[i];
          for (var s = 0; s < data.length; s++) {
            data[s] = 0;
          }
        }
      }
    }]);

    return Engine;
  }();

  var AudioProcess = function () {
    // has the lifetime of one onaudioprocess callback

    function AudioProcess(sampleTime, sampleRate, extInputBuffers, extOutputBuffers, graph, bufferPool, domTimestamp, bufferSize) {
      _classCallCheck(this, AudioProcess);

      this.sampleTime = Math.round(sampleTime);
      this.sampleRate = sampleRate;
      this.extInputBuffers = extInputBuffers;
      this.extOutputBuffers = extOutputBuffers;
      this.bufferPool = bufferPool;
      this.graph = graph;
      this.inputBuffers = {};
      this.domTimestamp = domTimestamp;
      this.bufferSize = bufferSize;
    }

    _createClass(AudioProcess, [{
      key: 'run',
      value: function run(prevOutputValues) {
        var _this = this;

        // Generate the graph's data for one sample.
        //
        // prevOutputValues is the outputValues of the previous run(), used for
        // handling feedback loops.
        var context = {
          sampleTime: this.sampleTime,
          sampleRate: this.sampleRate,
          extInputBuffers: this.extInputBuffers,
          extOutputBuffers: this.extOutputBuffers,
          getBuffer: this.bufferPool ? _.bind(this.bufferPool.getBuffer, this.bufferPool) : null,
          domTimestamp: this.domTimestamp,
          bufferSize: this.bufferSize
        };

        // recording of all outputs generated during this traversal; returned to
        // the caller who then passes it forward as prevOutputValues to the next
        // run
        var outputValues = {};

        // tracks which objects have been visited during this traversal
        var visited = {};

        var getOutput = function getOutput(vobject, output) {
          var outputPath = vobject.id + '[' + output + ']';

          // check in cache
          var cachedResult = _.get(outputValues, outputPath, undefined);

          // TODO - so we're not caching when a vobject returns falsy or [] ..
          if (cachedResult !== undefined) {
            return cachedResult;
          }

          // check if we have a circularity
          if (visited[vobject.id]) {
            // feedback loop, provide val from previous run
            return _.get(prevOutputValues, outputPath, undefined);
          }
          visited[vobject.id] = true;

          // eagerly evaluate arguments
          var inputs = _.reduce(_this.graph.dedgesTo[vobject.id], function (memo, inputDedge, toInput) {
            var result = getOutput(inputDedge.from, inputDedge.fromOutput);
            if (result !== undefined) {
              memo[toInput] = result;
            }
            return memo;
          }, {});

          // do actual work of this vobject
          var result = vobject.generate(context, inputs, _this.graph.dedges[vobject.id]);

          // cache output values
          outputValues[vobject.id] = result;

          if (result && result.length) {
            return result[output];
          }

          return undefined;
        };

        _.forOwn(this.graph.leaves, function (vobject) {
          return getOutput(vobject, 0);
        });

        return outputValues;
      }
    }]);

    return AudioProcess;
  }();

  var BufferPool = function () {
    function BufferPool(size) {
      _classCallCheck(this, BufferPool);

      this.heap = [];
      this.size = size;
    }

    _createClass(BufferPool, [{
      key: 'getBuffer',
      value: function getBuffer() {
        /* just use the JS engine's heap for now, could optimize this to try to
         * re-use them later */
        return new AudioArrayType(this.size);
      }
    }]);

    return BufferPool;
  }();

  var DEdge = function () {
    /**
     * A directed edge in a graph of VObjects
     *
     * @param from {VObject} the tail vobject
     * @param fromOutput {int} the output index on the tail vobject
     * @param to {VObject} the arrow vobject
     * #param toOutput {int} the input index on the arrow vobject
     */

    function DEdge(from, fromOutput, to, toInput) {
      _classCallCheck(this, DEdge);

      this.from = from;
      this.fromOutput = fromOutput;
      this.to = to;
      this.toInput = toInput;
    }

    _createClass(DEdge, [{
      key: 'id',
      value: function id() {
        return this.from.id + ',' + this.fromOutput + ',' + this.to.id + ',' + this.toInput;
      }
    }]);

    return DEdge;
  }();

  var VObjectGraph = function () {
    function VObjectGraph() {
      _classCallCheck(this, VObjectGraph);

      // TODO - these can all be made maps
      this.leaves = {};

      // one way map of vobject -> outgoing dedges
      //
      // {
      //   (from vobject id): {
      //      (from output index): [Dedge]
      //   }
      // }
      //
      // i.e. you can have multiple edges from each output
      this.dedges = {};

      // lookup of vobject -> incoming dedges (will be in sync with
      // this.dedges)
      this.dedgesTo = {};

      // list of vobjects in the graph
      this.vobjects = {};
    }

    _createClass(VObjectGraph, [{
      key: 'addVobject',
      value: function addVobject(vobject) {
        // initially, will be a leaf because it has no outputs
        this.leaves[vobject.id] = vobject;
        this.dedges[vobject.id] = {};
        this.vobjects[vobject.id] = vobject;
      }
    }, {
      key: 'removeVobject',
      value: function removeVobject(vobject) {
        var _this2 = this;

        delete this.vobjects[vobject.id];

        // remove edges going from the object
        delete this.dedges[vobject.id];

        // remove edges going to the object
        _.forOwn(this.dedgesTo[vobject.id], function (dedge) {
          var newEdges = _.filter(_this2.dedges[dedge.from.id][dedge.fromOutput], function (iterDedge) {
            return iterDedge.to !== vobject;
          });
          if (newEdges.length === 0) {
            delete _this2.dedges[dedge.from.id][dedge.fromOutput];
            if (_.keys(_this2.dedges[dedge.from.id]).length === 0) {
              delete _this2.dedges[dedge.from.id];
            }
          } else {
            _this2.dedges[dedge.from.id][dedge.fromOutput] = newEdges;
          }
        });
        delete this.dedgesTo[vobject.id];
        delete this.leaves[vobject.id];
      }
    }, {
      key: 'replaceVobject',
      value: function replaceVobject(vobject, newVobject) {
        var _this3 = this;

        this.addVobject(newVobject);
        _.forOwn(this.dedgesTo[vobject.id], function (dedge) {
          // TODO: what if the number of inputs changes?
          _this3.addDedge(dedge.from, dedge.fromOutput, newVobject, dedge.toInput);
        });
        _.forOwn(this.dedges[vobject.id], function (edges) {
          _.forOwn(edges, function (dedge) {
            // TODO: what if the number of outputs changes?
            _this3.addDedge(newVobject, dedge.fromOutput, dedge.to, dedge.toInput);
          });
        });
        this.removeVobject(vobject);
      }
    }, {
      key: 'addDedge',
      value: function addDedge(from, fromOutput, to, toInput) {
        if (!(from.id in this.dedges)) {
          this.dedges[from.id] = {};
        }
        if (!this.dedges[from.id][fromOutput]) {
          this.dedges[from.id][fromOutput] = [];
        }
        var outputEdges = this.dedges[from.id][fromOutput];
        var dedge = new DEdge(from, fromOutput, to, toInput);
        outputEdges.push(dedge);

        if (!(to.id in this.dedgesTo)) {
          this.dedgesTo[to.id] = {};
        }
        this.dedgesTo[to.id][toInput] = dedge;

        delete this.leaves[from.id];
      }
    }, {
      key: 'removeDedge',
      value: function removeDedge(from, fromOutput, to, toInput) {
        var edges = this.dedges[from.id][fromOutput];
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].from === from && edges[i].fromOutput === fromOutput && edges[i].to === to && edges[i].toInput === toInput) {
            edges.splice(i);
          }
        }

        // if theres no more edges from that output, delete the entry entirely
        if (!edges.length) {
          delete this.dedges[from.id][fromOutput];
        }

        delete this.dedgesTo[to.id][toInput];

        // did from just become a leaf?
        var anyOutputs = false;
        for (var i = 0; i < this.dedges[from.id].length; i++) {
          if (this.dedges[from.id].length) {
            anyOutputs = true;
            break;
          }
        }

        if (!anyOutputs) {
          this.leaves[from.id] = from;
        }
      }

      // XXX - is there a syntax for making this a generator??

    }, {
      key: 'getAllDedges',
      value: function getAllDedges() {
        var result = [];
        _.forOwn(this.dedges, function (outputs) {
          _.forOwn(outputs, function (dedges) {
            _.each(dedges, function (dedge) {
              result.push(dedge);
            });
          });
        });
        return result;
      }
    }]);

    return VObjectGraph;
  }();

  return {
    Engine: Engine, VObjectGraph: VObjectGraph, AudioProcess: AudioProcess, AudioArrayType: AudioArrayType
  };
});
//# sourceMappingURL=engine.js.map
