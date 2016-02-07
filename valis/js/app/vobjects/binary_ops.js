'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['app/vobjects/vobject', 'app/util'], function (vobject, util) {
  var BinaryOp = function (_vobject$VObject) {
    _inherits(BinaryOp, _vobject$VObject);

    function BinaryOp(options, operand) {
      _classCallCheck(this, BinaryOp);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BinaryOp).call(this, options, operand));

      _this.operand = operand;
      return _this;
    }

    _createClass(BinaryOp, [{
      key: 'numInputs',
      value: function numInputs() {
        return 2;
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
          return [0];
        }

        var firstIsAa = util.isAudioArray(inputs[0]);
        var secondIsAa = util.isAudioArray(inputs[1]);

        if (firstIsAa && secondIsAa) {
          var _result = context.getBuffer();
          for (var i = 0; i < inputs[0].length; i++) {
            _result[i] = this.fn(inputs[0][i], inputs[1][i]);
          }
          return [_result];
        }

        var aa = undefined;
        var scalar = undefined;

        if (secondIsAa) {
          aa = inputs[1];
          scalar = inputs[0];
        } else if (firstIsAa) {
          aa = inputs[0];
          scalar = inputs[1] || 0;
          if (scalar === undefined) {
            scalar = this.operand;
            if (scalar === undefined) {
              throw new Error('no operand found');
            }
          }
        } else {
          return [inputs[0] * inputs[1]];
        }

        var result = context.getBuffer();
        for (var i = 0; i < aa.length; i++) {
          result[i] = this.fn(aa[i], parseFloat(scalar));
        }

        return [result];
      }
    }]);

    return BinaryOp;
  }(vobject.VObject);

  var Mul = function (_BinaryOp) {
    _inherits(Mul, _BinaryOp);

    function Mul() {
      _classCallCheck(this, Mul);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Mul).apply(this, arguments));
    }

    _createClass(Mul, [{
      key: 'fn',
      value: function fn(a, b) {
        return a * b;
      }
    }]);

    return Mul;
  }(BinaryOp);

  Mul.vobjectClass = '*';
  Mul.vobjectSymbol = '*';

  var Add = function (_BinaryOp2) {
    _inherits(Add, _BinaryOp2);

    function Add() {
      _classCallCheck(this, Add);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Add).apply(this, arguments));
    }

    _createClass(Add, [{
      key: 'fn',
      value: function fn(a, b) {
        return a + b;
      }
    }]);

    return Add;
  }(BinaryOp);

  Add.vobjectClass = '+';
  Add.vobjectSymbol = '+';

  return { Mul: Mul, Add: Add };
});
//# sourceMappingURL=binary_ops.js.map
