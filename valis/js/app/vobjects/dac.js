'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['app/vobjects/vobject', 'app/util', 'app/console'], function (vobject, util, vconsole) {
  var DAC = function (_vobject$VObject) {
    _inherits(DAC, _vobject$VObject);

    function DAC() {
      _classCallCheck(this, DAC);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(DAC).apply(this, arguments));
    }

    _createClass(DAC, [{
      key: 'numInputs',

      // strictly stereo, for now
      value: function numInputs() {
        return 2;
      }
    }, {
      key: 'numOutputs',
      value: function numOutputs() {
        return 0;
      }
    }, {
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        /* copy additively into external output buffers */
        for (var i in inputs) {
          if (i >= context.extOutputBuffers.length) {
            continue;
          }

          var ib = inputs[i];
          if (ib === null) {
            throw new Error('input ' + i + ' === null');
          }

          if (!util.isAudioArray(ib)) {
            var type = '' + (typeof ib === 'undefined' ? 'undefined' : _typeof(ib)).toString();
            var str = ib ? '' + ib.toString().slice(0, 100) : '';
            throw new Error('input ' + i + ' received non-audio: ' + type + ', ' + str);
          }

          var buffer = context.extOutputBuffers[i];

          if (buffer.length !== ib.length) {
            throw new Error('input buffer length !== channel data length');
          }

          for (var s = 0; s < ib.length; s++) {
            // adds, so if there are multiple sources writing to the buffer
            // the audio will be mixed together
            buffer[s] += ib[s];
          }
        }
      }
    }]);

    return DAC;
  }(vobject.VObject);

  DAC.vobjectClass = 'output';
  DAC.vobjectSymbol = '&#x1f50a;';

  return DAC;
});
//# sourceMappingURL=dac.js.map
