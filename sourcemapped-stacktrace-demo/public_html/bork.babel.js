"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BabelBorker = (function () {
    function BabelBorker() {
        _classCallCheck(this, BabelBorker);
    }

    _createClass(BabelBorker, [{
        key: "bork",
        value: function bork() {
            throw new Error("bork from es6");
        }
    }]);

    return BabelBorker;
})();

window.babel_bork = function () {
    return new BabelBorker().bork();
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvcmsuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNLFdBQVc7YUFBWCxXQUFXOzhCQUFYLFdBQVc7OztpQkFBWCxXQUFXOztlQUNULGdCQUFHO0FBQ0gsa0JBQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDcEM7OztXQUhDLFdBQVc7OztBQU1qQixNQUFNLENBQUMsVUFBVSxHQUFHO1dBQU0sSUFBSSxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUU7Q0FBQSxDQUFBIiwiZmlsZSI6InVuZGVmaW5lZCIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEJhYmVsQm9ya2VyIHtcbiAgICBib3JrKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJib3JrIGZyb20gZXM2XCIpO1xuICAgIH1cbn1cblxud2luZG93LmJhYmVsX2JvcmsgPSAoKSA9PiBuZXcgQmFiZWxCb3JrZXIoKS5ib3JrKClcbiJdfQ==
