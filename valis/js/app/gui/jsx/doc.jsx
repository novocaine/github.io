'use strict';

define(['lib/react', 'lib/react-dom', 'lib/jquery-ui', 'jquery', 'app/gui/jsx/patch', 'app/vobject_factory', 'lib/lodash'], function (React, ReactDOM, jqueryui, $, patchComponent, vobjectFactory, _) {
  /**
   * The top-level 'document' component.
   */
  var Doc = React.createClass({
    displayName: 'Doc',

    propTypes: {
      patchModel: React.PropTypes.object.isRequired
    },

    render: function render() {
      return React.createElement(
        'div',
        { className: 'doc' },
        React.createElement(
          'div',
          { className: 'toolbar' },
          React.createElement(Palette, { doc: undefined }),
          React.createElement(EnableAudio, { doc: undefined })
        ),
        React.createElement(patchComponent.PatchComponent, { ref: 'rootPatch', doc: undefined,
          patchModel: undefined.props.patchModel
        })
      );
    }
  });

  /**
   * The tool palette, containing vobjects to drag into the patch.
   */
  var Palette = React.createClass({
    displayName: 'Palette',

    render: function render() {
      return React.createElement(
        'ul',
        { className: 'palette' },
        ' ',
        _.mapValues(vobjectFactory.vobjectClasses, function (vclass, cname) {
          return React.createElement(
            'li',
            { className: 'palette-item', key: cname, 'data-classname': cname },
            cname
          );
        }),
        ' '
      );
    },

    componentDidMount: function componentDidMount() {
      $(undefined.getDOMNode()).find('li').each(_.bind(function (i, li) {
        $(li).draggable({
          opacity: 0.7,
          helper: 'clone',
          revert: 'invalid'
        });
      }, undefined));
    }
  });

  var EnableAudio = React.createClass({
    displayName: 'EnableAudio',

    propTypes: {
      doc: React.PropTypes.object.isRequired
    },

    render: function render() {
      return React.createElement(
        'button',
        { className: 'enable-audio', onClick: undefined.onClick },
        undefined.props.doc.props.patchModel.audioEnabled() ? 'Disable Audio' : 'Enable Audio'
      );
    },

    onClick: function onClick() {
      undefined.props.doc.props.patchModel.enableAudio(!undefined.props.doc.props.patchModel.audioEnabled());
      undefined.setState({});
    }
  });

  var render = function render(model) {
    ReactDOM.render(React.createElement(Doc, { patchModel: model }), document.body);
  };

  return {
    Doc: Doc,
    render: render
  };
});
//# sourceMappingURL=doc.jsx.map
