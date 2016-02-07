'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['app/vobjects/vobject', 'app/util'], function (vobject, util) {
  var Delay = function (_vobject$VObject) {
    _inherits(Delay, _vobject$VObject);

    function Delay(options) {
      var delay = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];

      _classCallCheck(this, Delay);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Delay).call(this, options, delay));

      _this.delay = delay;
      // circular buffer
      _this._buf = null;
      _this._ptr = null;
      return _this;
    }

    _createClass(Delay, [{
      key: 'numInputs',
      value: function numInputs() {
        return 1;
      }
    }, {
      key: 'numOutputs',
      value: function numOutputs() {
        return 1;
      }
    }, {
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        if (inputs[0] === undefined) {
          return [];
        }

        if (!util.isAudioArray(inputs[0])) {
          throw Error('input must be audio');
        }

        var result = context.getBuffer();
        var delaySamples = this.delay * context.sampleRate;

        if (this._buf === null) {
          this._buf = util.allocBuffer(delaySamples);
        }

        // write output from buffer
        for (var _i = 0; _i < result.length && _i < this._buf.length; _i++) {
          result[_i] = this._buf[this._ptr++ % this._buf.length];
        }

        var i = 0;

        // write input delayed directly to result (when delay < bufsize)
        for (var r = this._buf.length; i < inputs[0].length && r < result.length; i++, r++) {
          result[r] = inputs[0][i];
        }

        // fix up the ptr to avoid it getting crazy large eventually
        this._ptr = this._ptr % this._buf.length;

        if (delaySamples > this._buf.length) {
          // user increased the length of the delay, so reallocate it.
          // TODO: this discards the existing buffer entirely, which
          // still contains relevant data if delay was > bufsize
          this._buf = util.allocBuffer(delaySamples);
        }

        // write unwritten input overflow to the buffer
        for (var b = this._ptr - 1, j = inputs[0].length - 1; j >= i; j--, b--) {
          // % doesn't modulo correctly for negatives
          if (b < 0) {
            b = this._buf.length - 1;
          }
          this._buf[b] = inputs[0][j];
        }

        return [result];
      }
    }]);

    return Delay;
  }(vobject.VObject);

  Delay.vobjectClass = 'delay';
  Delay.vobjectSymbol = 'del';

  return Delay;
});
//# sourceMappingURL=delay.js.map
