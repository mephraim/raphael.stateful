window.onload = function() {
  var paper = Raphael(0,0, 800, 600);
  var rect = paper.rect(20, 20, 100, 100);
  
  rect.addState('blah', { 
    attrs: { 
      height: 100 
    }
  });
  
  rect.state('blah');
}

