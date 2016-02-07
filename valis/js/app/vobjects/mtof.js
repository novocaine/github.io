'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['lodash', 'app/vobjects/vobject', 'app/msg'], function (_, vobject, Message) {
  var MtoF = function (_vobject$VObject) {
    _inherits(MtoF, _vobject$VObject);

    _createClass(MtoF, [{
      key: 'numInputs',
      value: function numInputs() {
        return 1;
      }
    }, {
      key: 'numOutputs',
      value: function numOutputs() {
        return 2;
      }
    }]);

    function MtoF(options) {
      _classCallCheck(this, MtoF);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MtoF).call(this, options));

      _this._lastFreq = 0.0;
      _this._notesOn = 0;
      return _this;
    }

    _createClass(MtoF, [{
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        var _this2 = this;

        var result = context.getBuffer();
        var gateMsgs = [];
        var lastNoteTime = 0;

        if (inputs[0]) {
          inputs[0].forEach(function (msg) {
            // msg is expected to be the format created by 'midi'.
            if (msg.data.type === 0x90) {
              // note on
              _this2._lastFreq = _this2.frequencyFromNoteNumber(msg.data.note);
              // The notes occured at an earlier sample time, so we need to move
              // them forward into this context's frame - add the current buffer
              // len to them. TODO - maybe it's necessary to delay even more?
              // this will cause jitter if the note occurred any earlier than the
              // previous buffer render period, which I suspect might be common
              // ..
              var sampleOffset = msg.sampleTime + result.length - context.sampleTime;
              if (sampleOffset < 0) {
                sampleOffset = 0;
              }
              result.fill(_this2._lastFreq, lastNoteTime, sampleOffset);
              lastNoteTime = sampleOffset;
              gateMsgs.push(new Message(msg.sampleTime + result.length, 1));
              _this2._notesOn++;
            } else if (msg.data.type === 0x80) {
              // don't release the gate while we've still got notes on
              if (--_this2._notesOn === 0) {
                gateMsgs.push(new Message(msg.sampleTime + result.length, 0));
              }
            }
          });
          result.fill(this._lastFreq, lastNoteTime);
        }

        return [result, gateMsgs];
      }
    }, {
      key: 'frequencyFromNoteNumber',
      value: function frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
      }
    }]);

    return MtoF;
  }(vobject.VObject);

  MtoF.vobjectClass = 'mtof';
  MtoF.vobjectSymbol = 'mtof';

  return MtoF;
});
//# sourceMappingURL=mtof.js.map
