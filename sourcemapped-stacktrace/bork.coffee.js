// Generated by CoffeeScript 1.7.1
(function() {
  var Borker;

  Borker = (function() {
    function Borker() {}

    Borker.prototype.bork = function() {
      throw new Error("Bork from coffeescript");
    };

    return Borker;

  })();

  window.bork = function() {
    return new Borker().bork();
  };

}).call(this);

//# sourceMappingURL=bork.coffee.map