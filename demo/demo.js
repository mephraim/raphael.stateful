window.onload = function() {
  var paper = Raphael(0,0, 1000, 1000);
  rect(paper);
  circle(paper);
}

function rect(paper) {
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

function circle(paper) {
  var circle = paper.circle(500, 300, 30);
  
  circle.addState('smaller', {
    attrs: {
      r: 30,
      fill: 'white'
    },
        
    handlers: {
      onmouseover: function() {
        circle.state('bigger', { time: 500 });
      }
    }
  });
  circle.state('smaller');
  
  circle.addState('bigger', {
    attrs: {
      r: 100,
      fill: '#35B183'
    },
    
    handlers: {
      onmouseout: function() {
        circle.state('smaller', { time: 500 });
      }
    }
  });
}

