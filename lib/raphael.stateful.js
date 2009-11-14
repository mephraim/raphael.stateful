(function() {
  var EVENT_HANDLERS = ['onfocusin', 'onfocusout', 'onactivate', 
                        'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 
                        'onmousemove', 'onmouseout',
                        'onkeydown', 'onkeyup', 'onkeypress'];
    
  Raphael.el.addState = function(name, rules) {
    this._states = this._states || {};
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
    
    clearHandlers(element);
    
    if (state.handlers) {
      setHandlers(element, state.handlers);
    }
    
    setAttrsForState(element, state.attrs, options.time, function() {
      if (options.after) { options.after.apply(element); }
      if (state.after) { state.after.apply(element); }
    });
  };
  
  function clearHandlers(element) {
    for(var handler in EVENT_HANDLERS) {
      element.node[EVENT_HANDLERS[handler]] = null;
    }
  }
  
  function setHandlers(element, handlers) {
    for(var handler in handlers) {
      element.node[handler] = handlers[handler];
    }
  }
  
  function setAttrsForState(element, attrs, time, callback) {
    if (time) {
      element.animate(attrs, time, callback)
    } else {
      console.log(attrs);
      element.attr(attrs);
      callback();
    }
  };
})();