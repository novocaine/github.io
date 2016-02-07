'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['app/engine', 'lodash', 'app/vobject_factory'], function (engine, _, VObjectFactory) {
  var PatchModel = function () {
    function PatchModel(patchJSON) {
      var _this = this;

      _classCallCheck(this, PatchModel);

      // TODO: move this into a parent 'doc' when we support sub-patches
      this.engine = new engine.Engine();
      this.graph = this.engine.graph;

      if (!patchJSON) {
        // new blank document
        this.vobjectPositions = {};
        this.vobjectFactory = new VObjectFactory(0);
      } else {
        var json = _.isString(patchJSON) ? JSON.parse(patchJSON) : patchJSON;
        this.vobjectPositions = json.vobjectPositions;
        this.vobjectFactory = new VObjectFactory(json.nextVobjectId);

        _.each(json.vobjects, function (vobjectDesc, id) {
          var _vobjectFactory;

          var vobject = (_vobjectFactory = _this.vobjectFactory).create.apply(_vobjectFactory, [vobjectDesc.vobjectClass, id].concat(_toConsumableArray(vobjectDesc.args)));
          _this.graph.addVobject(vobject);
        });

        _.each(json.dedges, function (dedgeDesc) {
          _this.graph.addDedge(_this.graph.vobjects[dedgeDesc.from], dedgeDesc.fromOutput, _this.graph.vobjects[dedgeDesc.to], dedgeDesc.toInput);
        });
      }
    }

    _createClass(PatchModel, [{
      key: 'addVobject',
      value: function addVobject(vobject, x, y) {
        // add to underlying graph
        this.graph.addVobject(vobject);
        this.vobjectPositions[vobject.id] = { x: x, y: y };
      }
    }, {
      key: 'updateVobjectArgs',
      value: function updateVobjectArgs(vobject, args) {
        var _vobjectFactory2;

        // delete and re-instantiate the object with new arguments
        var newVobject = (_vobjectFactory2 = this.vobjectFactory).create.apply(_vobjectFactory2, [vobject.constructor.vobjectClass, null].concat(_toConsumableArray(args)));
        this.graph.replaceVobject(vobject, newVobject);
        this.vobjectPositions[newVobject.id] = this.vobjectPositions[vobject.id];
        delete this.vobjectPositions[vobject.id];
      }

      // keep positions and sizes of vobjects up to date here after each render
      // for fast access when rendering dedges (otherwise the dedge renderer
      // would have to measure the items every time, which is slow)

    }, {
      key: 'setVobjectPosition',
      value: function setVobjectPosition(vobjectId, x, y) {
        this.vobjectPositions[vobjectId] = { x: x, y: y };
      }
    }, {
      key: 'getVobjectPosition',
      value: function getVobjectPosition(vobjectId) {
        return this.vobjectPositions[vobjectId];
      }
    }, {
      key: 'enableAudio',
      value: function enableAudio() {
        var enabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        enabled ? this.engine.start() : this.engine.stop();
      }
    }, {
      key: 'audioEnabled',
      value: function audioEnabled() {
        return this.engine.running;
      }
    }, {
      key: 'toJSON',
      value: function toJSON() {
        var dedges = _.map(this.engine.graph.getAllDedges(), function (dedge) {
          return {
            from: dedge.from.id,
            fromOutput: dedge.fromOutput,
            to: dedge.to.id,
            toInput: dedge.toInput
          };
        });

        var vobjects = _.reduce(this.engine.graph.vobjects, function (memo, vobject) {
          memo[vobject.id] = {
            vobjectClass: vobject.constructor.vobjectClass,
            args: vobject.args
          };
          return memo;
        }, {});

        return { dedges: dedges, vobjects: vobjects, vobjectPositions: this.vobjectPositions,
          nextVobjectId: this.vobjectFactory.nextId };
      }
    }]);

    return PatchModel;
  }();

  return PatchModel;
});
//# sourceMappingURL=patch_model.js.map
