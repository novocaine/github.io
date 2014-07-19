class Borker
  bork: () ->
    throw new Error("Bork from coffeescript")
    
window.bork = () -> new Borker().bork()
