(function() {
  var EVENT_HANDLERS = ['onfocusin', 'onfocusout', 'onactivate', 
                        'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 
                        'onmousemove', 'onmouseout',
                        'onkeydown', 'onkeyup', 'onkeypress'];
    
  Raphael.el.addState = function(name, rules) {
    this._states = this._states || {};
    this._states[name] = rules;
    
    return this;
  };
  
  Raphael.el.getState = function(name) {
    if (!this._states || !this._states.hasOwnProperty(name)) {
      throw new RaphaelStatefulExpection("You tried to find a state that hasn't been added yet.");
    }
    
    return this._states[name];
  };
    
  Raphael.el.state = function(name, options) {
    if(arguments.length === 0) {
      return this._currentState;
    }
    
    var element = this;
    options = options || {};
    
    var state = element.getState(name);
    this._currentState = name;
    
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
    
    return element;
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
      element.attr(attrs);
      callback();
    }
  };

  var RaphaelStatefulExpection = function(message) {
    this.message = message;
  }
  
  RaphaelStatefulExpection.prototype = {
    name: "RaphaelStatefulExpection", 
    toString: function() {
      return this.message;
    }
  }
})();