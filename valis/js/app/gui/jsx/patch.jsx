'use strict';

define(['lib/react', 'lib/lodash', 'app/gui/jsx/vobjects/simple', 'app/vobject_factory', 'lib/jquery'], function (React, _, simple, vobjectFactory, $) {
  var PatchComponent = React.createClass({
    displayName: 'PatchComponent',

    propTypes: {
      patchModel: React.PropTypes.object.isRequired
    },

    render: function render() {
      return React.createElement(
        'div',
        { className: 'patch' },
        React.createElement(
          'div',
          { className: 'vobjects' },
          _.mapValues(undefined.props.patchModel.graph.vobjects, function (vobject) {
            return undefined.renderVObject(undefined.props.patchModel, vobject);
          }, undefined)
        ),
        React.createElement(
          'svg',
          null,
          React.createElement(DrawingDedgeLine, { ref: 'drawingDedgeLine' }),
          _.bind(function () {
            var result = [];
            undefined.props.patchModel.graph.iterDedges(_.bind(function (dedge) {
              result.push(React.createElement(DEdge, { dedge: dedge, patchModel: undefined.props.patchModel,
                patchComponent: undefined }));
            }, undefined));
            return result;
          }, undefined)()
        )
      );
    },

    renderVObject: function renderVObject(patchModel, vobject) {
      return React.createElement(simple.SimpleVObjectComponent, {
        vobject: vobject,
        key: vobject.id,
        patchModel: patchModel,
        patchComponent: undefined });
    },

    componentDidMount: function componentDidMount() {
      $(undefined.getDOMNode()).droppable({
        accept: '.palette-item',
        drop: _.bind(function (event, ui) {
          var vobject = vobjectFactory.create(ui.helper.attr('data-classname'));
          var domNode = $(undefined.getDOMNode());
          var offset = domNode.offset();
          undefined.props.patchModel.addVobject(vobject, ui.position.left - offset.left, ui.position.top - offset.top);
          // trigger re-render
          undefined.setState({});
        }, undefined)
      });
    },

    startDrawingDedge: function startDrawingDedge(fromVobjectComponent, fromOutputNum, clientX, clientY) {
      var line = undefined.refs.drawingDedgeLine;

      // convert clientX, clientY from window co-ordinates to patch
      // co-ordinates
      var domNode = $(undefined.getDOMNode());
      var offset = domNode.offset();
      var startX = clientX - offset.left;
      var startY = clientY - offset.top;

      // attach patch-wide mousemove
      domNode.on('mousemove', function (emm) {
        line.setState({
          startX: startX,
          startY: startY,
          drawToX: emm.clientX - offset.left,
          drawToY: emm.clientY - offset.top,
          visible: true
        });
        return false;
      });

      domNode.one('mouseup', _.bind(function (e) {
        domNode.off('mousemove');
        line.setState({
          visible: false
        });

        // dropped on an input?
        var elem = $(document.elementFromPoint(e.clientX, e.clientY));
        if (!elem.length) {
          return;
        }

        var input = elem.closest('[data-input-index]');
        if (!input.length) {
          return;
        }

        var vobjectElem = elem.closest('[data-vobject-id]');
        if (!vobjectElem.length) {
          return;
        }

        var toVobject = undefined.props.patchModel.graph.vobjects[parseInt(vobjectElem.attr('data-vobject-id'), 10)];
        var toInput = parseInt(input.attr('data-input-index'), 10);

        undefined.props.patchModel.graph.addDedge(fromVobjectComponent.props.vobject, fromOutputNum, toVobject, toInput);
        undefined.setState({});
      }, undefined));
    },

    updateVobject: function updateVobject(vobjectComponent) {
      // redraw the edges attached to this vobject (maybe it moved)
      // XXX for now ..
      undefined.forceUpdate();
    }
  });

  /**
   * The line being drawn while user draws a new dedge
   */
  var DrawingDedgeLine = React.createClass({
    displayName: 'DrawingDedgeLine',

    getInitialState: function getInitialState() {
      return { visible: false };
    },

    render: function render() {
      var style = {
        visibility: undefined.state.visible ? 'visible' : 'hidden',
        strokeWidth: 1,
        stroke: 'rgb(0, 0, 0)'
      };

      return React.createElement('line', { x1: undefined.state.startX,
        y1: undefined.state.startY,
        x2: undefined.state.drawToX,
        y2: undefined.state.drawToY,
        style: style });
    }
  });

  var DEdge = React.createClass({
    displayName: 'DEdge',

    // hard-coded sizing metrics to avoid having to do lookups against the
    // live elements. TODO - maybe we could look this up once then cache them?
    statics: {
      outputX_padding: 30,
      inputX_padding: 30
    },

    propTypes: {
      dedge: React.PropTypes.object.isRequired,
      patchModel: React.PropTypes.object.isRequired,
      patchComponent: React.PropTypes.object.isRequired
    },

    render: function render() {
      // calculate tail pos
      var vobjectFrom = undefined.props.dedge.from;
      var vobjectFromPos = undefined.props.patchModel.vobjectPositions[vobjectFrom.id];

      var vobjectFromElem = simple.findVobjectElem(vobjectFrom.id);
      var tailPos = {
        x: vobjectFromPos.x + undefined.props.dedge.fromOutput * DEdge.outputX_padding,
        y: vobjectFromPos.y + vobjectFromElem.height()
      };

      // calculate arrow pos
      var vobjectTo = undefined.props.dedge.to;
      var vobjectToPos = undefined.props.patchModel.vobjectPositions[vobjectTo.id];

      var arrowPos = {
        x: vobjectToPos.x + undefined.props.dedge.toInput * DEdge.inputX_padding,
        y: vobjectToPos.y
      };

      return React.createElement('line', { className: 'dedge', x1: tailPos.x,
        y1: tailPos.y,
        x2: arrowPos.x,
        y2: arrowPos.y,
        onClick: undefined.onClick });
    },

    onClick: function onClick() {
      // delete
      undefined.props.patchModel.graph.removeDedge(undefined.props.dedge.from, undefined.props.dedge.fromOutput, undefined.props.dedge.to, undefined.props.dedge.toInput);

      undefined.props.patchComponent.forceUpdate();
    }
  });

  return { PatchComponent: PatchComponent };
});
//# sourceMappingURL=patch.jsx.map
