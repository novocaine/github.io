'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['lodash', 'app/vobjects/vobject', 'app/msg'], function (_, vobject, Message) {
  var Midi = function (_vobject$VObject) {
    _inherits(Midi, _vobject$VObject);

    _createClass(Midi, [{
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

    function Midi(options) {
      _classCallCheck(this, Midi);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Midi).call(this, options));

      _this._messages = [];

      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({}).then(function (midiAccess) {
          // success. TODO: this listens on all interfaces, should be a way to
          // select
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = midiAccess.inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var input = _step.value;

              input[1].onmidimessage = _.bind(_this.onMIDIMessage, _this);
              console.log('registered midi input ' + input[1].name);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }, function (e) {
          // failure
          throw Error('Error initializing MIDI: ' + e.toString());
        });
      } else {
        throw Error('This browser does not support MIDI');
      }
      return _this;
    }

    _createClass(Midi, [{
      key: 'onMIDIMessage',
      value: function onMIDIMessage(event) {
        // the message format is pretty damn unwieldy, so convert it into
        // something legible..
        var data = event.data;
        var message = {
          cmd: data[0] >> 4,
          channel: data[0] & 0xf,
          type: data[0] & 0xf0,
          note: data[1],
          velocity: data[2],
          timeStamp: event.receivedTime
        };
        this._messages.push(message);
      }
    }, {
      key: 'generate',
      value: function generate(context, inputs, outputs) {
        var result = [this._messages.map(function (msg) {
          // this is going to be a time before the start of the current context's
          // sampleTime, as the note happened in the past
          var sampleTime = Math.round((msg.timeStamp - context.domTimestamp) / 1000.0 * context.sampleRate + context.sampleTime);
          return new Message(sampleTime, msg);
        })];
        this._messages = [];
        return result;
      }
    }]);

    return Midi;
  }(vobject.VObject);

  Midi.vobjectClass = 'midi';
  Midi.vobjectSymbol = 'midi';

  return Midi;
});
//# sourceMappingURL=midi.js.map
