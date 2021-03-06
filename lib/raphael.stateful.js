/** 
 * raphael.stateful plugin
 * Copyright (c) 2010 @author Matthew Ephraim
 *
 * licensed under the MIT license 
 */
(function() {
  var EVENT_HANDLERS = ['onfocusin', 'onfocusout', 'onactivate', 
                        'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 
                        'onmousemove', 'onmouseout',
                        'onkeydown', 'onkeyup', 'onkeypress'];
  
  addStateFunctions(Raphael.el);
      
  /**
   * Calling the state function on a Raphael element without any
   * parameters will return the element's current state.
   *
   * @return the name of the state
   *
   * Calling the state function with a string parameter will transition
   * the element to the state that matches the name (if it has a matching state).
   *
   * @param {String} the name of the state to transition to
   *
   * @param {Object} options (optional) a list of options 
   *  Available options 
   *    before: a function that will be called before any of the state transitions
   *    after: a function that will be called after all of the state transitions
   *    have completed  
   *
   * @return the Raphael element
   **/
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
      element.animate(attrs, time, callback);
    } else {
      element.attr(attrs);
      callback();
    }
  }
  
  function addStateFunctions(obj) {
    obj.addState = function(name, rules) {
      this._states = this._states || {};
      this._states[name] = rules;

      return this;
    };

    obj.getState = function(name) {
      if (!this.hasState(name)) {
        throw new RaphaelStatefulException("You tried to find a state that hasn't been added yet.");
      }

      return this._states[name];
    };
 
    obj.hasState = function(name) {
      var states = this._states;
      if (states && states.hasOwnProperty(name)) {
        return true;
      }
    
      return false;
    };
  }
  
  /**
   * Wrap the Raphael function with decorator that extends the set
   * function with extra state functionality 
   **/
  window.Raphael = (function(R) {
    return function() {
      return overrideSet(R.apply(window, arguments)); 
    };

    function overrideSet(paper) {
      paper.set = (function(original) {
        return function() {
          return extendSet(original.apply(paper, arguments));
        };
      })(paper.set);

      return paper;
    }

    function extendSet(set) {
      addStateFunctions(set);

      set.state = function(name, options) {
        if(arguments.length === 0) {
          return this._currentState;
        }
       
        options = options || {}; 
        this._currentState = name;

        if (options.before) {
          options.before.apply(this);
        }

        var state; 
        if (this.hasState(name)) {
          state = this.getState(name);
          
          if (state.before) {
            state.before.apply(this);
          }
        }

        var items = this.items;
        for(var i = 0, length = items.length; i < length; i++) {
          var item = items[i];
          if (item.hasState(name)) {
            item.state(name, options);
          }
        }
       
        if (options.after) {
          options.after.apply(this);
        }
        
        if (state && state.after) {
          state.after.apply(this);
        }

        return set;
      };

      return set;
    }
  })(window.Raphael);
  
  var RaphaelStatefulException = function(message) {
    this.message = message;
  };
  
  RaphaelStatefulException.prototype = {
    name: "RaphaelStatefulException", 
    toString: function() {
      return this.message;
    }
  };
})();

