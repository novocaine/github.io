"use strict";

define([], function () {
  var save = function save(patchModel, name, version) {
    window.localStorage.setItem(JSON.stringify([name, version]), JSON.stringify(patchModel.toJSON()));
  };

  var load = function load(patchModel, name, version) {};

  return { save: save, load: load };
});
//# sourceMappingURL=storage.js.map
