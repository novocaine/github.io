'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['lodash', 'app/vobjects/vobject', 'app/msg', 'app/util'], function (_, vobject, Message, util) {
  var Pulse = function (_vobject$VObject) {
    _inherits(Pulse, _vobject$VObject);

    _createClass(Pulse, [{
      key: 'numInputs',
      value: function numInputs() {
        return 0;
      }
    }, {
      key: 'numOutputs',
      value: function numOutputs() {
        return 1;
      }
    }]);

    function Pulse(options, bpm, pulseLength) {
      _classCallCheck(this, Pulse);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pulse).call(this, options, bpm, pulseLength));

      _this.bpm = parseFloat(bpm); // in beats per minute
      _this.pulseLength = parseFloat(pulseLength); // in beats
      _this._nextMsgSampleTime = null;
      _this._nextMessageData = 1;
      return _this;
    }

    _createClass(Pulse, [{
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        var samplePeriod = util.bpmToPeriod(this.bpm, context.sampleRate);
        var sampleTimePulse = util.bpmToPeriod(this.bpm / this.pulseLength, context.sampleRate);
        var sampleTimeAfterPulse = Math.abs(samplePeriod - sampleTimePulse);
        var messages = [];

        var t = this._nextMsgSampleTime === null ? context.sampleTime : this._nextMsgSampleTime;

        // skip ticks if we have fallen behind - these can't be delivered late
        // as timing is too important
        var behindBy = context.sampleTime - t;
        if (behindBy > 0) {
          t += Math.ceil(behindBy / samplePeriod) * samplePeriod;
        }

        for (; t < context.sampleTime + context.bufferSize; t += this._nextMessageData ? sampleTimeAfterPulse : sampleTimePulse) {
          messages.push(new Message(t, this._nextMessageData));
          this._nextMessageData = this._nextMessageData ? 0 : 1;
        }

        this._nextMsgSampleTime = t;

        return [messages];
      }
    }]);

    return Pulse;
  }(vobject.VObject);

  Pulse.vobjectClass = 'pulse';
  Pulse.vobjectSymbol = 'pulse';

  return Pulse;
});
//# sourceMappingURL=pulse.js.map
