'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['app/vobjects/vobject'], function (vobject) {
  var JS = function (_vobject$VObject) {
    _inherits(JS, _vobject$VObject);

    _createClass(JS, [{
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

    function JS(options, script) {
      _classCallCheck(this, JS);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JS).call(this, options, script));

      _this.script = script;
      return _this;
    }

    _createClass(JS, [{
      key: 'generate',
      value: function generate(contxt, inputs, outputs) {
        var result = eval(this.script);
        // if result isn't an array, make it into one (i.e output one value) as a
        // convenience
        if (Array.isArray(result)) {
          return result;
        }

        return [result];
      }
    }], [{
      key: 'processArgString',
      value: function processArgString(argString) {
        return [argString];
      }
    }]);

    return JS;
  }(vobject.VObject);

  JS.vobjectClass = 'js';
  JS.vobjectSymbol = '&gt;';

  return JS;
});
//# sourceMappingURL=js.js.map
