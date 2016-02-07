'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['lodash', 'app/vobjects/vobject', 'app/msg', 'app/util'], function (_, vobject, Message, util) {
  var Arpeggiator = function (_vobject$VObject) {
    _inherits(Arpeggiator, _vobject$VObject);

    _createClass(Arpeggiator, [{
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

    function Arpeggiator(options) {
      var _Object$getPrototypeO;

      _classCallCheck(this, Arpeggiator);

      for (var _len = arguments.length, frequencies = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        frequencies[_key - 1] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Arpeggiator)).call.apply(_Object$getPrototypeO, [this, options].concat(frequencies)));

      _this.frequencies = _.map(frequencies, function (s) {
        return parseFloat(s);
      });
      return _this;
    }

    _createClass(Arpeggiator, [{
      key: 'nextFrequency',
      value: function nextFrequency() {
        return this.frequencies[Math.floor(Math.random() * this.frequencies.length)];
      }
    }, {
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        var _this2 = this;

        if (inputs[0] === undefined) {
          return [];
        }

        var frequencies = _.reduce(inputs[0], function (memo, msg) {
          // gen new freq on rising edge only
          if (msg.data) {
            memo.push(new Message(msg.sampleTime, _this2.nextFrequency()));
          }
          return memo;
        }, []);

        return [frequencies];
      }
    }]);

    return Arpeggiator;
  }(vobject.VObject);

  Arpeggiator.vobjectClass = 'arpeggiator';
  Arpeggiator.vobjectSymbol = 'arp';

  return Arpeggiator;
});
//# sourceMappingURL=arp.js.map
