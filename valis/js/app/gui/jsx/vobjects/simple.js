'use strict';

define(['react', 'react-dom', 'jquery', 'lodash', 'lib/react-textarea-autosize/TextareaAutosize'], function (React, ReactDOM, $, _, Textarea) {
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
      this.makeDraggable();
    },
    onOutputMouseDown: function onOutputMouseDown(e) {
      var patchElem = $(ReactDOM.findDOMNode(this)).parents('.patch');
      if (!patchElem.length) {
        throw new Error("couldn't find parent patch");
      }

      this.props.patchComponent.startDrawingDedge(this, parseInt($(e.currentTarget).attr('data-output-index'), 10), e.clientX, e.clientY);

      e.stopPropagation();
    },
    onDoubleClick: function onDoubleClick(e) {
      this.showPropertiesPage();
    },
    makeDraggable: function makeDraggable() {
      var _this = this;

      $(ReactDOM.findDOMNode(this)).draggable({
        drag: function drag(event, ui) {
          // move the patch
          _this.props.patchModel.setVobjectPosition(_this.props.vobject.id, ui.position.left, ui.position.top);

          // tell the parent patch to redraw it
          _this.props.patchComponent.updateVobject(_this);
        },
        stop: function stop(event, ui) {
          _this.props.patchModel.setVobjectPosition(_this.props.vobject.id, ui.position.left, ui.position.top);
        }
      }).addClass('draggable');
    },
    render: function render() {
      var _this2 = this;

      var pos = this.props.patchModel.getVobjectPosition(this.props.vobject.id);
      var style = {
        position: 'absolute',
        top: pos.y,
        left: pos.x
      };

      return React.createElement(
        'div',
        { className: 'vobject-simple', 'data-vobject-id': this.props.vobject.id,
          style: style
        },
        React.createElement(
          'div',
          { className: 'inputs' },
          _.range(this.props.vobject.numInputs()).map(function (i) {
            return React.createElement('span', { className: 'input', 'data-input-index': i, key: i });
          })
        ),
        React.createElement('span', { className: 'vobject-class',
          dangerouslySetInnerHTML: { __html: this.props.vobject.constructor.vobjectSymbol }
        }),
        React.createElement(Textarea, { className: 'args', rows: 1, onBlur: this.onChangeArgs,
          defaultValue: this.props.vobject.args.join(" ")
        }),
        React.createElement(
          'div',
          { className: 'outputs' },
          _.range(this.props.vobject.numOutputs()).map(function (i) {
            return React.createElement('span', { className: 'output', 'data-output-index': i,
              onMouseDown: _this2.onOutputMouseDown, key: i
            });
          }, this)
        )
      );
    },
    onChangeArgs: function onChangeArgs(e) {
      var args = this.props.vobject.constructor.processArgString(e.target.value);
      if (_.isEqual(this.props.vobject.args, args)) {
        return;
      }
      this.props.patchModel.updateVobjectArgs(this.props.vobject, args);
      // re-render so that all vobject refs gets updated
      this.props.patchComponent.setState({});
    }
  });

  var findVobjectElem = function findVobjectElem(vobjectId) {
    return $('[data-vobject-id=' + vobjectId + ']');
  };

  return { SimpleVObjectComponent: SimpleVObjectComponent,
    // XXX: possibly not the right place for this, but only if we ever end up
    // with different classes of vobject
    findVobjectElem: findVobjectElem
  };
});
//# sourceMappingURL=simple.js.map
