'use strict';

define([], function () {
  var functions = {
    isAudioArray: function isAudioArray(object) {
      // typeof doesn't even remotely work :/
      return Object.prototype.toString.call(object) === '[object Float32Array]';
    },

    allocBuffer: function allocBuffer(samples) {
      return new Float32Array(samples);
    },

    bpmToFrequency: function bpmToFrequency(bpm, sampleRate) {
      return bpm / 60.0 / sampleRate;
    },

    bpmToPeriod: function bpmToPeriod(bpm, sampleRate) {
      return 1.0 / functions.bpmToFrequency(bpm, sampleRate);
    }
  };

  return functions;
});
//# sourceMappingURL=util.js.map
