'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['lodash', 'app/vobjects/vobject'], function (_, vobject) {
  var ADSR = function (_vobject$VObject) {
    _inherits(ADSR, _vobject$VObject);

    _createClass(ADSR, [{
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

    function ADSR() {
      var _Object$getPrototypeO;

      _classCallCheck(this, ADSR);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ADSR)).call.apply(_Object$getPrototypeO, [this].concat(args)));

      _this.attack = args[0];
      _this.decay = args[1];
      _this.sustain = args[2];
      _this.release = args[3];
      return _this;
    }

    return ADSR;
  }(vobject.VObject);

  return ADSR;
});
//# sourceMappingURL=asdr.js.map
