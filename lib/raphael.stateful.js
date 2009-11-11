(function() {
  Raphael.el._states = [];
  
  Raphael.el.addState = function(name, rules) {
    this._states[name] = rules;
  };
  
  Raphael.el.getState = function(name) {
    return this._states[name];
  };
  
  Raphael.el.state = function(name, options) {
    var element = this;
    options = options || {};
    var state = element.getState(name);
    
    if (options.before) {
       options.before.apply(element);
    }
    
    if (state.before) {
     state.before.apply(element);
    }
    
    setAttrsForState(element, state.attrs, options.time, function() {
      if (options.after) {
        options.after.apply(element);
      }
      
      if (state.after) {
        state.after.apply(element);
      }
    });
  };
  
  function setAttrsForState(element, attrs, time, callback) {
    if (time) {
      element.animate(attrs, time, callback)
    } else {
      element.attr(attrs);
      callback();
    }
  };
})();