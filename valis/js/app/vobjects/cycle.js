'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['app/vobjects/vobject', 'app/util', 'lodash'], function (vobject, util, _) {
  var Cycle = function (_vobject$VObject) {
    _inherits(Cycle, _vobject$VObject);

    _createClass(Cycle, [{
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

    function Cycle(options) {
      var frequency = arguments.length <= 1 || arguments[1] === undefined ? 440 : arguments[1];

      _classCallCheck(this, Cycle);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cycle).call(this, options, frequency));

      _this.frequency = frequency;
      _this._prevx = 0.0;
      _this._prevFrequency = 0.0;
      return _this;
    }

    _createClass(Cycle, [{
      key: 'generateXmodResult',
      value: function generateXmodResult(context, frequency) {
        var result = context.getBuffer();
        var x = this._prevx;
        for (var i = 0; i < result.length; i++) {
          var radiansPerSample = frequency[i] * 2 * Math.PI / context.sampleRate;
          x += radiansPerSample;
          result[i] = Math.cos(x);
        }
        this._prevx = x;
      }
    }, {
      key: 'generateFixedFreqResult',
      value: function generateFixedFreqResult(result, context, frequency, from, until) {
        from = Math.min(Math.max(from, 0), result.length);
        until = Math.min(Math.max(until, 0), result.length);

        var radiansPerSample = frequency * 2 * Math.PI / context.sampleRate;
        if (until === undefined) {
          until = result.length;
        }
        for (var i = from; i < until; i++) {
          this._prevx += radiansPerSample;
          result[i] = Math.cos(this._prevx);
        }
      }
    }, {
      key: 'generateMsgResult',
      value: function generateMsgResult(result, context, messages) {
        this.generateFixedFreqResult(result, context, this._prevFrequency, 0, messages.length === 0 ? result.length : messages[0].sampleTime - context.sampleTime);

        for (var i = 0; i < messages.length; i++) {
          var msg = messages[i];
          this.generateFixedFreqResult(result, context, msg.data, msg.sampleTime - context.sampleTime, i === messages.length - 1 ? result.length : messages[i + 1].sampleTime - context.sampleTime);
        }

        if (messages.length) {
          this._prevFrequency = messages[messages.length - 1].data;
        }
      }
    }, {
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        var frequency = 0 in inputs ? inputs[0] : this.frequency;
        var result = context.getBuffer();

        if (util.isAudioArray(frequency)) {
          this.generateXmodResult(context, frequency);
        } else if (_.isNumber(frequency)) {
          this.generateFixedFreqResult(result, context, frequency, 0, result.length);
        } else if (_.isArray(frequency)) {
          this.generateMsgResult(result, context, frequency);
        } else {
          throw Error('unexpected input type');
        }

        return [result];
      }
    }]);

    return Cycle;
  }(vobject.VObject);

  Cycle.vobjectClass = 'oscillator';
  Cycle.vobjectSymbol = 'osc';

  return Cycle;
});
//# sourceMappingURL=cycle.js.map
