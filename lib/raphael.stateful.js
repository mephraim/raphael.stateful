(function() {
  Raphael.el._states = [];
  
  Raphael.el.addState = function(name, definition) {
    this._states[name] = definition;
  };
  
  Raphael.el.getState = function(name) {
    return this._states[name];
  }
})();