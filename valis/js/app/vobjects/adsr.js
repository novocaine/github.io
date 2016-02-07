'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['lodash', 'app/vobjects/vobject'], function (_, vobject) {
  var ADSREnvelope = function (_vobject$VObject) {
    _inherits(ADSREnvelope, _vobject$VObject);

    _createClass(ADSREnvelope, [{
      key: 'numInputs',
      value: function numInputs() {
        return 1;
      }
    }, {
      key: 'numOutputs',
      value: function numOutputs() {
        return 1;
      }
    }]);

    function ADSREnvelope(options) {
      var attack = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var decay = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
      var sustain = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var release = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];

      _classCallCheck(this, ADSREnvelope);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ADSREnvelope).call(this, options, attack, decay, sustain, release));

      _this.attack = Math.max(0.01, parseFloat(attack));
      _this.decay = Math.max(0.01, parseFloat(decay));
      _this.sustain = parseFloat(sustain);
      _this.release = Math.max(0.01, parseFloat(release));
      _this._triggerOn = null;
      _this._triggerOff = null;
      _this._ptr = 0;
      _this._lastOutput = 0;
      _this._outputAtTriggerOff = 0;
      _this._outputAtTriggerOn = 0;
      return _this;
    }

    _createClass(ADSREnvelope, [{
      key: 'genEnvelope',
      value: function genEnvelope(context, result, triggerOn, until, ptr) {
        var attackSampleTime = this.attack * context.sampleRate;
        var attackGradient = (1.0 - this._outputAtTriggerOn) / attackSampleTime;
        var decaySampleTime = this.decay * context.sampleRate;
        var decayGradient = (-1.0 + this.sustain) / decaySampleTime;
        var decaySampleEnd = decaySampleTime + attackSampleTime;

        // attack phase
        var r = triggerOn - context.sampleTime;
        if (r < 0) {
          r = 0;
        }
        for (; ptr < attackSampleTime && r < result.length && r + context.sampleTime < until; r++, ptr++) {
          this._lastOutput += attackGradient;
          result[r] = this._lastOutput;
        }

        // decay phase
        for (; ptr < decaySampleEnd && r < result.length && r + context.sampleTime < until; r++, ptr++) {
          this._lastOutput += decayGradient;
          result[r] = this._lastOutput;
        }

        // sustain phase
        for (; r < result.length && r + context.sampleTime < until; r++) {
          this._lastOutput = result[r] = this.sustain;
        }

        return ptr;
      }
    }, {
      key: 'genReleaseEnvelope',
      value: function genReleaseEnvelope(context, result, triggerOff, until, ptr) {
        var releaseSampleTime = this.release * context.sampleRate;
        var releaseGradient = -this._outputAtTriggerOff / releaseSampleTime;

        var r = triggerOff - context.sampleTime;
        if (r < 0) {
          r = 0;
        }
        for (; ptr < releaseSampleTime && r < result.length && r + context.sampleTime < until; r++, ptr++) {
          this._lastOutput += releaseGradient;
          result[r] = this._lastOutput;
        }

        if (ptr >= releaseSampleTime) {
          this._triggerOff = null;
        }

        return ptr;
      }
    }, {
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        if (!inputs[0]) {
          return [];
        }
        var result = context.getBuffer();

        // finish playing envelope from messages in previous generates
        var untilPrev = inputs[0].length ? inputs[0][0].sampleTime : Number.MAX_VALUE;
        if (this._triggerOn) {
          this._ptr = this.genEnvelope(context, result, this._triggerOn, untilPrev, this._ptr);
        } else if (this._triggerOff) {
          this._ptr = this.genReleaseEnvelope(context, result, this._triggerOff, untilPrev, this._ptr);
        }

        for (var i = 0; i < inputs[0].length; i++) {
          var message = inputs[0][i];

          // limit the playback of the envelope until next message
          var until = i === inputs[0].length - 1 ? Number.MAX_VALUE : inputs[0][i + 1].sampleTime;

          if (message.data) {
            // gate on
            this._triggerOn = message.sampleTime;
            this._outputAtTriggerOn = this._lastOutput;
            this._ptr = 0;
            this._triggerOff = null;
            this._ptr = this.genEnvelope(context, result, this._triggerOn, until, this._ptr);
            // TODO: disabling this puts the envelope into 'legato' mode, which
            // isn't always what you want - but enabling causes pops which need
            // to be ramped out
            // this._lastOutput = this._lastOutput;
          } else {
              // gate off
              this._ptr = 0;
              this._triggerOn = null;
              this._triggerOff = message.sampleTime;
              this._outputAtTriggerOff = this._lastOutput;
              this._ptr = this.genReleaseEnvelope(context, result, this._triggerOff, until, this._ptr);
            }
        }

        return [result];
      }
    }]);

    return ADSREnvelope;
  }(vobject.VObject);

  ADSREnvelope.vobjectClass = 'adsr';
  ADSREnvelope.vobjectSymbol = 'adsr';

  return ADSREnvelope;
});
//# sourceMappingURL=adsr.js.map
