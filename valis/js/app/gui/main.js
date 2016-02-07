'use strict';

define(['app/gui/jsx/doc', 'app/patch_model', 'jquery'], function (doc, PatchModel, $) {
  var init = function init() {
    // entry point for the app. Create a ocument and render the gui.

    // do we have a JSON document specified in the url?
    var params = location.search;
    var match = params.match(/\?.*patch=([^&]+)/);
    if (match) {
      $.get(match[1]).done(function (json) {
        var model = new PatchModel(json);
        start(model);
      }).fail(function () {
        var model = new PatchModel();
        start(model);
      });
    } else {
      start(new PatchModel());
    }
  };

  var start = function start(model) {
    // enable audio by default
    model.enableAudio();
    doc.render(model);
  };

  return { init: init };
});
//# sourceMappingURL=main.js.map
