'use strict';

define(['react', 'react-dom', 'jquery-ui', 'jquery', 'app/gui/jsx/patch', 'app/vobject_factory', 'lodash', 'filesaver'], function (React, ReactDOM, jqueryui, $, patchComponent, vobjectFactory, _, filesaver) {
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
          React.createElement(Palette, { vobjectClasses: this.props.patchModel.vobjectFactory.constructor.vobjectClasses }),
          React.createElement(ToJSON, { doc: this }),
          React.createElement(EnableAudio, { doc: this })
        ),
        React.createElement(patchComponent.PatchComponent, { ref: 'rootPatch', doc: this,
          patchModel: this.props.patchModel
        })
      );
    }
  });

  /**
   * The tool palette, containing vobjects to drag into the patch.
   */
  var Palette = React.createClass({
    displayName: 'Palette',

    propTypes: {
      vobjectClasses: React.PropTypes.object.isRequired
    },

    render: function render() {
      return React.createElement(
        'ul',
        { className: 'palette' },
        ' ',
        _.map(this.props.vobjectClasses, function (vclass, cname) {
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
      // XXX: I think .draggable will break when we update Palette
      // (but we don't yet)
      $(ReactDOM.findDOMNode(this)).find('li').each(function (i, li) {
        $(li).draggable({
          opacity: 0.7,
          helper: 'clone',
          revert: 'invalid'
        });
      });
    }
  });

  var ToJSON = React.createClass({
    displayName: 'ToJSON',

    propTypes: {
      doc: React.PropTypes.object.isRequired
    },

    render: function render() {
      return React.createElement(
        'button',
        { className: 'to-json', onClick: this.onClick },
        this.props.doc.props.patchModel.audioEnabled() ? 'toJSON' : 'Enable Audio'
      );
    },
    onClick: function onClick() {
      var json = JSON.stringify(this.props.doc.props.patchModel.toJSON());
      var blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      filesaver(blob, 'valis.json');
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
        { className: 'enable-audio', onClick: this.onClick },
        this.props.doc.props.patchModel.audioEnabled() ? 'Disable Audio' : 'Enable Audio'
      );
    },
    onClick: function onClick() {
      this.props.doc.props.patchModel.enableAudio(!this.props.doc.props.patchModel.audioEnabled());
      this.setState({});
    }
  });

  var render = function render(model) {
    $('#splash-loading').hide();
    var doc = ReactDOM.render(React.createElement(Doc, { patchModel: model }), document.getElementById('doc'));
    return doc;
  };

  return {
    Doc: Doc,
    render: render
  };
});
//# sourceMappingURL=doc.js.map
