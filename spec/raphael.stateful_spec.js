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
  });
  
  describe("the addState function", function() {
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
  });
});

