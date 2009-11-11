window.onload = function() {
  var paper = Raphael(0,0, 800, 600);
  var rect = paper.rect(20, 20, 100, 100);
  
  rect.addState('bigger', { 
    attrs: { 
      height: 300,
      width: 300,
      strokeWeight: 500,
      fill: '#3C9CD3'
    }
  });
  
  rect.addState('smaller', {
    attrs: {
      height: 100,
      width: 100,
      fill: '#FFE563',
      stroke: '#F7FF00'
    }
  });
  
  rect.state('bigger', { 
    time: 1000,
    after: function() {
      rect.state('smaller', { time: 1000 });
    }
  });
}

