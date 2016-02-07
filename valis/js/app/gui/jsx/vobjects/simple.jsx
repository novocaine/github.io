'use strict';

define(['lib/react', 'app/gui/jsx/util', 'jquery', 'lib/lodash'], function (React, util, $, _) {
  /**
   * Implementation of a default vobject with no fancy custom gui
   */
  var SimpleVObjectComponent = React.createClass({
    displayName: 'SimpleVObjectComponent',

    propTypes: {
      patchModel: React.PropTypes.object.isRequired,
      patchComponent: React.PropTypes.object.isRequired,
      vobject: React.PropTypes.object.isRequired
    },

    componentDidMount: function componentDidMount() {
      undefined.makeDraggable();
    },

    onOutputMouseDown: function onOutputMouseDown(e) {
      var patchElem = $(undefined.getDOMNode()).parents('.patch');
      if (!patchElem.length) {
        throw new Error("couldn't find parent patch");
      }

      undefined.props.patchComponent.startDrawingDedge(undefined, parseInt($(e.currentTarget).attr('data-output-index'), 10), e.clientX, e.clientY);

      e.stopPropagation();
    },

    makeDraggable: function makeDraggable() {
      $(undefined.getDOMNode()).draggable({
        drag: _.bind(function (event, ui) {
          // move the patch
          undefined.props.patchModel.setVobjectPosition(undefined.props.vobject.id, ui.position.left, ui.position.top);

          // tell the parent patch to redraw it
          undefined.props.patchComponent.updateVobject(undefined);
        }, undefined),
        stop: _.bind(function (event, ui) {
          undefined.props.patchModel.setVobjectPosition(undefined.props.vobject.id, ui.position.left, ui.position.top);
        }, undefined)
      }).addClass('draggable');
    },

    render: function render() {
      var pos = undefined.props.patchModel.getVobjectPosition(undefined.props.vobject.id);
      var style = {
        position: 'absolute',
        top: pos.y,
        left: pos.x
      };

      return React.createElement(
        'div',
        { className: 'vobject-simple', 'data-vobject-id': undefined.props.vobject.id,
          style: style
        },
        React.createElement(
          'div',
          { className: 'inputs' },
          _.range(undefined.props.vobject.numInputs()).map(function (i) {
            return React.createElement('span', { className: 'input', 'data-input-index': i });
          })
        ),
        React.createElement(
          'div',
          { className: 'title' },
          undefined.props.vobject.constructor.vobjectClass
        ),
        React.createElement(
          'div',
          { className: 'outputs' },
          _.range(undefined.props.vobject.numOutputs()).map(function (i) {
            return React.createElement('span', { className: 'output', 'data-output-index': i,
              onMouseDown: undefined.onOutputMouseDown
            });
          }, undefined)
        )
      );
    }
  });

  var findVobjectElem = function findVobjectElem(vobjectId) {
    return $('[data-vobject-id=${vobjectId}]');
  };

  return { SimpleVObjectComponent: SimpleVObjectComponent,
    // XXX: possibly not the right place for this, but only if we ever end up
    // with different classes of vobject
    findVobjectElem: findVobjectElem
  };
});
//# sourceMappingURL=simple.jsx.map
