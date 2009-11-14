Screw.Unit(function() {  
  var paper;
  var element;
  before(function() {
    paper = Raphael(0,0,100,100);
    rect = paper.rect(0,0,10,10);
  });
   
  describe("Stateful plugin for Raphael elements", function() {    
    it("adds an addState function to Raphael elements", function() {
      expect(jQuery.isFunction(rect.addState)).to(equal, true);
    });
    
    it("adds a getState function to Raphael elements", function() {
      expect(jQuery.isFunction(rect.getState)).to(equal, true);
    });
    
    it("adds a state function to Raphael elements", function() {
      expect(jQuery.isFunction(rect.state)).to(equal, true);
    });
  });
  
  describe("the addState function", function() {
    it("returns the element after being called", function() {
      expect(rect.addState('test', {})).to(equal, rect);
    });
    
    it("adds a state to the element", function() {
      var state = { attrs: { height: 100 } };
      rect.addState('test', state);
      
      expect(rect._states['test']).to(equal, state);
    });
  });
  
  describe("the getState function", function() {
    it("returns the state that matches the name", function() {
      var state = { attrs: { height: 100 } };
      rect.addState('test', state);

      expect(rect.getState('test')).to(equal, state);
    });
  
    it("throws an exception if the state wasn't found", function() {
      var errorMessage = null
      try {
        rect.getState('zzzzz');
      }
      catch(e) {
        errorMessage = e.message;
      }
      
      expect(errorMessage).to(equal, "You tried to find a state that hasn't been added yet.");
    });
  });
  
  describe("the state function", function() {
    it("returns the element after being called", function() {
      rect.addState('test', {});
      expect(rect.state('test')).to(equal, rect);
    });
    
    describe("event handler changes", function() {
      it("clears out event handlers when switching states", function() {
        rect.node.onclick = function() { };
        rect.addState('test', {});
        rect.state('test');
        
        expect(rect.node.onclick).to(equal, null);
      });
      
      it("creates event handlers for each of the events passed in under handlers", function() {
        var mouseoverCalled = false,
            clickCalled = false;
        
        rect.addState('test', {
          handlers: {
            onmouseover: function() {
              mouseoverCalled = true;
            },
            
            onclick: function() { 
              clickCalled = true;
            }
          }
        });
        
        rect.state('test');
        rect.node.onmouseover();
        rect.node.onclick();
        
        expect(mouseoverCalled).to(equal, true);
        expect(clickCalled).to(equal, true);
      });
    });
    
    describe("attribute changes", function() {
      it("it switches the attributes of the element to match the attributes for the state", function() {
        rect.addState('test', { 
          attrs: { height: 100, fill: 'green' }
        });

        rect.attr({ height: 0, fill: 'blue' });
        rect.state('test');
        expect(rect.attr('height')).to(equal, 100);
        expect(rect.attr('fill')).to(equal, 'green');
      });

      it("animates with the right speed if a time is passed in", function() {
        var animationSpeed;
        rect.animate = function(attr, speed) {
          animationSpeed = speed;
        }

        rect.addState('test', {}); 
        rect.state('test', { time: 5000 });

        expect(animationSpeed).to(equal, 5000);
      });
    });
  
    describe("before callbacks", function() {
      it("executes the before function that was passed in before switching states", function() {
        var stateSwitched = false;
        var beforeCalled = false;

        rect.attr = function() {
          stateSwitched = true;
        };

        rect.addState('test', {});

        rect.state('test', {
          before: function() {
            if (!stateSwitched) {
              beforeCalled = true;
            }
          }
        });

        expect(beforeCalled).to(equal, true);
      });

      it("executes the before function that is part of the state before switching states", function() {
        var stateSwitched = false;
        var beforeCalled = false;

        rect.attr = function() {
          stateSwitched = true;
        };

        rect.addState('test', {
          before: function() {
            if (!stateSwitched) {
              beforeCalled = true;
            }
          }
        });
        rect.state('test', {});

        expect(beforeCalled).to(equal, true);
      });
    
      it("only executes before handlers that are related to the element with the state", function() {        
        var beforeCalled = false;
        rect.addState('rectTest', {
          before: function() {
            beforeCalled = true;
          }
        });
        
        var circle = paper.circle(0,0,20);
        circle.addState('circleTest', {});
        circle.state('circleTest');
        
        expect(beforeCalled).to(equal, false);
      });
    });
    
    describe("after callbacks", function() {
      it("executes the after function that was passed in after switching states normally", function() {
        var stateSwitched = false;
        var afterCalled = false;

        rect.attr = function() {
          stateSwitched = true;
        };

        rect.addState('test', {});
        rect.state('test', {
          after: function() {
            if (stateSwitched) {
              afterCalled = true;
            }
          }
        });

        expect(afterCalled).to(equal, true);
      });

      it("executes the after function that was passed in after switching states with animation", function() {
        var stateSwitched = false;
        var afterCalled = false;

        rect.animate = function(attrs, time, callback) {
          if (callback) {
            stateSwitched = true;
          }
          callback.apply(this);
        };

        rect.addState('test', {});
        rect.state('test', {
          time: 2,
          after: function() {
            if (stateSwitched) {
              afterCalled = true;
            }
          }
        });

        expect(afterCalled).to(equal, true);
      });

      it("executes the after function that is part of the state after switching states normally", function() {
        var stateSwitched = false;
        var afterCalled = false;

        rect.attr = function() {
          stateSwitched = true;
        };

        rect.addState('test', {
          after: function() {
            if (stateSwitched) {
              afterCalled = true;
            }
          }
        });

        rect.state('test');
        expect(afterCalled).to(equal, true);
      });
      
      it("executes the after function that is part of the state after switching states with animation", function() {
        var stateSwitched = false;
        var afterCalled = false;

        rect.animate = function(attrs, time, callback) {
          if (callback) {
            stateSwitched = true;
          }
          callback.apply(this);
        };

        rect.addState('test', {
          after: function() {
            if (stateSwitched) {
              afterCalled = true;
            }
          }
        });
        rect.state('test', { time: 2 });

        expect(afterCalled).to(equal, true);
      });
    });
  });
});

