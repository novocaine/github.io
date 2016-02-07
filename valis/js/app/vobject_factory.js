'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['app/vobjects/js', 'app/vobjects/dac', 'app/vobjects/cycle', 'app/vobjects/binary_ops', 'app/vobjects/delay', 'app/vobjects/midi', 'app/vobjects/mtof', 'app/vobjects/log', 'app/vobjects/adsr', 'app/vobjects/pulse', 'app/vobjects/arp', 'lodash'], function (JS, DAC, Cycle, binaryOps, Delay, Midi, MtoF, Log, ADSREnvelope, Pulse, Arpeggiator, _) {
  // register them here
  var classList = [JS, DAC, Cycle, binaryOps.Mul, binaryOps.Add, Delay, Midi, MtoF, Log, ADSREnvelope, Pulse, Arpeggiator];

  var VObjectFactory = function () {
    function VObjectFactory(nextId) {
      _classCallCheck(this, VObjectFactory);

      this.nextId = nextId;
    }

    _createClass(VObjectFactory, [{
      key: 'create',
      value: function create(vobjectClassname, id) {
        if (!(vobjectClassname in this.constructor.vobjectClasses)) {
          throw new Error('vobject with class ' + vobjectClassname + ' not found');
        }
        id = id === undefined || id === null ? this.nextId++ : id;

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var vobject = new (Function.prototype.bind.apply(this.constructor.vobjectClasses[vobjectClassname], [null].concat([{ id: id }], args)))();
        return vobject;
      }
    }]);

    return VObjectFactory;
  }();

  VObjectFactory.vobjectClasses = _.fromPairs(classList.map(function (_class) {
    return [_class.vobjectClass, _class];
  }));

  return VObjectFactory;
});
//# sourceMappingURL=vobject_factory.js.map
