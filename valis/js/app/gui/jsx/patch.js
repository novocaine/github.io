'use strict';

define(['react', 'react-dom', 'lodash', 'app/gui/jsx/vobjects/simple', 'app/vobject_factory', 'jquery'], function (React, ReactDOM, _, simple, vobjectFactory, $) {
  var PatchComponent = React.createClass({
    displayName: 'PatchComponent',

    propTypes: {
      patchModel: React.PropTypes.object.isRequired
    },

    render: function render() {
      var _this = this;

      return React.createElement(
        'div',
        { className: 'patch' },
        React.createElement(
          'div',
          { className: 'vobjects' },
          _.map(this.props.patchModel.graph.vobjects, function (vobject) {
            return React.createElement(simple.SimpleVObjectComponent, {
              vobject: vobject,
              key: vobject.id,
              patchModel: _this.props.patchModel,
              patchComponent: _this });
          })
        ),
        React.createElement(
          'svg',
          null,
          React.createElement(DrawingDedgeLine, { ref: 'drawingDedgeLine' }),
          _.map(this.props.patchModel.graph.getAllDedges(), function (dedge) {
            return React.createElement(DEdge, { dedge: dedge, patchModel: _this.props.patchModel,
              patchComponent: _this, key: dedge.id() });
          })
        )
      );
    },
    componentDidMount: function componentDidMount() {
      var _this2 = this;

      $(ReactDOM.findDOMNode(this)).droppable({
        accept: '.palette-item',
        drop: function drop(event, ui) {
          var vobject = _this2.props.patchModel.vobjectFactory.create(ui.helper.attr('data-classname'));
          var domNode = $(ReactDOM.findDOMNode(_this2));
          var offset = domNode.offset();
          _this2.props.patchModel.addVobject(vobject, ui.position.left - offset.left, ui.position.top - offset.top);
          // trigger re-render
          _this2.setState({});
          // focus args of the new object, XXX: seems to break into react's dom
          $('[data-vobject-id=' + vobject.id + '] textarea').focus();
        }
      });
    },
    startDrawingDedge: function startDrawingDedge(fromVobjectComponent, fromOutputNum, clientX, clientY) {
      var _this3 = this;

      var line = this.refs.drawingDedgeLine;

      // convert clientX, clientY from window co-ordinates to patch
      // co-ordinates
      var domNode = $(ReactDOM.findDOMNode(this));
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

      domNode.one('mouseup', function (e) {
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

        var toVobject = _this3.props.patchModel.graph.vobjects[parseInt(vobjectElem.attr('data-vobject-id'), 10)];
        var toInput = parseInt(input.attr('data-input-index'), 10);

        _this3.props.patchModel.graph.addDedge(fromVobjectComponent.props.vobject, fromOutputNum, toVobject, toInput);
        _this3.setState({});
      });
    },
    updateVobject: function updateVobject(vobjectComponent) {
      // redraw the edges attached to this vobject (maybe it moved)
      // XXX for now ..
      this.forceUpdate();
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
        visibility: this.state.visible ? 'visible' : 'hidden',
        strokeWidth: 1,
        stroke: 'rgb(0, 0, 0)'
      };

      return React.createElement('line', { x1: this.state.startX,
        y1: this.state.startY,
        x2: this.state.drawToX,
        y2: this.state.drawToY,
        style: style });
    }
  });

  var DEdge = React.createClass({
    displayName: 'DEdge',

    // hard-coded sizing metrics to avoid having to do lookups against the
    // live elements. TODO - maybe we could look this up once then cache them?
    statics: {
      outputXPadding: 30,
      outputXLeftMargin: 28,
      inputXPadding: 30,
      inputXLeftMargin: 28,
      vobjectHeight: 44
    },

    propTypes: {
      dedge: React.PropTypes.object.isRequired,
      patchModel: React.PropTypes.object.isRequired,
      patchComponent: React.PropTypes.object.isRequired
    },

    render: function render() {
      // calculate tail pos
      var vobjectFrom = this.props.dedge.from;
      var vobjectFromPos = this.props.patchModel.vobjectPositions[vobjectFrom.id];

      var tailPos = {
        x: vobjectFromPos.x + DEdge.outputXLeftMargin + this.props.dedge.fromOutput * DEdge.outputXPadding,
        y: vobjectFromPos.y + DEdge.vobjectHeight
      };

      // calculate arrow pos
      var vobjectTo = this.props.dedge.to;
      var vobjectToPos = this.props.patchModel.vobjectPositions[vobjectTo.id];

      var arrowPos = {
        x: vobjectToPos.x + DEdge.inputXLeftMargin + this.props.dedge.toInput * DEdge.inputXPadding,
        y: vobjectToPos.y
      };

      return React.createElement('line', { className: 'dedge', x1: tailPos.x,
        y1: tailPos.y,
        x2: arrowPos.x,
        y2: arrowPos.y,
        onClick: this.onClick });
    },
    onClick: function onClick() {
      // delete
      this.props.patchModel.graph.removeDedge(this.props.dedge.from, this.props.dedge.fromOutput, this.props.dedge.to, this.props.dedge.toInput);

      this.props.patchComponent.forceUpdate();
    }
  });

  return { PatchComponent: PatchComponent };
});
//# sourceMappingURL=patch.js.map
