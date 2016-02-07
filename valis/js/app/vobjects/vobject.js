'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['lodash'], function (_) {
  var VObject = function () {
    function VObject(options) {
      _classCallCheck(this, VObject);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // options is an object passed through from the factory code that is
      // undertood by this superclass (currently only containing an id); args
      // is the list of args from the end-user
      this.args = args;
      this.id = options.id;

      if (this.id === undefined) {
        throw Error('Vobject ctor not passed id');
      }
    }

    _createClass(VObject, [{
      key: 'numInputs',
      value: function numInputs() {
        throw new Error('abstract');
      }
    }, {
      key: 'numOutputs',
      value: function numOutputs() {
        throw new Error('abstract');
      }
    }], [{
      key: 'processArgString',
      value: function processArgString(argString) {
        if (argString.trim().length === 0) {
          return [];
        }
        return _.map(argString.split(' '), function (elem) {
          return elem.trim();
        });
      }
    }]);

    return VObject;
  }();

  return {
    VObject: VObject
  };
});
//# sourceMappingURL=vobject.js.map
