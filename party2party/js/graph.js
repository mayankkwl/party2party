var config={
  
  radius:{
    active: 70,
    inActive:38
  },

  strokeWidth:{
    active:3,
    inActive:2
  },

  strokeWidthHover:{
    active:5,
    inActive:3
  },

  avatar:{
    radius:{
      active:65,
      inActive: 35
    },
    x:{
      active:-33,
      inActive: -18
    },
    y:{
      active:-65,
      inActive: -35
    }
  },

  text:{
    x:{
      active:0,
      inActive:0
    },
    y:{
      active:15,
      inActive:12
    },
    size:{
      active:16,
      inActive:12
    }
  },

  line:{
    x1:{
      active:-58,
      inActive:0
    },
    y1:{
      active:40,
      inActive:100
    },
    x2:{
      active:58,
      inActive:0
    },
    y2:{
      active:40,
      inActive:100
    },
  },
  txtWorth:{
      x:{
        active:0,
        inActive:0
      },
      y:{
        active:58,
        inActive:40
      }
  },

  canvas:{
    width:getCanvasWidth(),
    height:getCanvasHeight()
  },
  forceLayout:{
    charge:-800,
    linkDistance:200
  }
}

function getCanvasWidth(){
  return ($(".dashboard").width()-($(".left-pane").width()+40));
}
function getCanvasHeight(){
  var _height = ($(".dashboard").width()-($(".left-pane").width()+40))/1.33;
  _height = (_height >= 600) ? 600 : _height;
  return _height;
}

// Common Functions to Avoid repeatation of Code Starts
function relationColor(relType){
  var color='black';
  switch (relType){
    case 'client': color='#8dc63f'; break;
    case 'prospect': color='#00aeef'; break;
    case 'contact': color='#e82626'; break;
    case 'self': color='#8dc63f'; break;
  }
  return color;
}

function fetchVal(obj,isActive){
  return isActive?obj.active:obj.inActive;
}

// Common Functions to Avoid repeatation of Code Ends

// Global Variable Starts
var svg,graph,drag,link,node,markerLink;
// Global Variable Ends


function renderGraph(json){
  force = d3.layout.force()
    .size([config.canvas.width, config.canvas.height])
    .charge(config.forceLayout.charge)
    .linkDistance(function(d){return d.target.linkDistance;})
    .on("tick", tick);


drag = force.drag()
    .on("dragstart", dragstart);



svg = d3.select("div.graphContainer")
            .attr('style','height:'+config.canvas.height+'px;width:'+config.canvas.width+'px;')
            .append("svg")
            .attr("width", config.canvas.width-2)
            .attr("height", config.canvas.height-2);

linkGroup=svg.append('g')
             .attr('class','linkGroup'),
link = linkGroup.selectAll("path.link");

markerLinkGroup=svg.append('g')
                    .attr('class','markerLinkGroup'),
markerLink=markerLinkGroup.selectAll('.markerLink');

nodeGroup=svg.append('g')
             .attr('class','nodeGroup'),
node = nodeGroup.selectAll("g.logoClass");

startMarkerGroup=svg.append('svg:defs')
                    .attr('class','startMarkerGroup');
endMarkerGroup=svg.append('svg:defs')
                    .attr('class','endMarkerGroup');                    
midMarkerGroup=svg.append('svg:defs')
                    .attr('class','midMarkerGroup');


graph=json;
force.nodes(graph.nodes)
    .links(graph.links)
    .start();

//Group for Clip paths
clipPathGroup=svg.append('g')
                  .attr('class','clipPathGroup');


// Clip Paths
clipPathGroup
   .append('clipPath')
   .attr('id','activeLogo')
    .append('circle')
    .attr('cx',0)
    .attr('cy',config.avatar.radius.active/2+config.avatar.y.active)
    .attr('r',config.avatar.radius.active/2);

clipPathGroup
   .append('clipPath')
   .attr('id','inActiveLogo')
      .append('circle')
        .attr('cx',0)
        .attr('cy',config.avatar.radius.inActive/2+config.avatar.y.inActive)
        .attr('r',config.avatar.radius.inActive/2);

updateGraph();
}


function updateGraph(){
  force.nodes(graph.nodes)
    .links(graph.links)
    .start();





// Build Connector1
endMarker=endMarkerGroup.selectAll("marker.endMarker")
                        .data(graph.links);      // Different link/path types can be defined here
endMarker.enter().append("svg:marker")    // This section adds in the connector1
                  .attr('class','endMarker')
          .attr("id",function(d){return "connector1"+d.source.id+""+d.target.id})
          .attr('markerUnits','userSpaceOnUse')
          .attr("refX", 65)
          .attr("refY", 20)
          .attr("markerWidth", 30)
          .attr("markerHeight", 40)
          .attr('orient','auto')
        .append("svg:path")
          .attr("d", "M30,0 Q30,20 0,20 Q30,20 30,40Z")
          .attr('fill',function(d){return relationColor(d.target.relation.type)});

endMarker.exit().remove();


// Build Connector2
startMarker=startMarkerGroup.selectAll("marker.startMarker")
    .data(graph.links);      // Different link/path types can be defined here
startMarker  .enter().append("svg:marker")    // This section adds in the connector2
    .attr('class','startMarker')
.attr("id",function(d){return "connector2"+d.source.id+""+d.target.id})
    .attr('markerUnits','userSpaceOnUse')
    .attr("refX", -35)
    .attr("refY", 20)
    .attr("markerWidth", 30)
    .attr("markerHeight", 40)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,0 Q0,20 30,20 Q0,20 0,40Z")
    .attr('fill',function(d){return relationColor(d.target.relation.type)});
startMarker.exit().remove();

// Build Relation Text
relMarker=midMarkerGroup.selectAll("marker.midMarker")
    .data(graph.links);

relEnter=relMarker.enter()
         .append("svg:marker")
         .attr('class','midMarker');

relEnter
    .attr("id",function(d){return "midMarker"+d.source.id+""+d.target.id})    
    .attr("viewBox", "0 0 50 15")
    .attr("refX", 40)
    .attr("refY", 7)
    .attr('markerUnits','userSpaceOnUse')
    .attr("markerWidth", 80)
    .attr("markerHeight", 23)
    .attr("orient", "auto");

relMarker.exit().remove();
  

  relEnter.append("svg:rect")
    .attr('rx',6)
    .attr('ry',6)
    .attr("x", 2)
    .attr("y", 2)
    .attr("width", 40)
    .attr("height", 10)    
    .attr('fill','white')
    .style('stroke',function(d){return relationColor(d.target.relation.type)})
    .attr('stroke-width',1);

  relEnter.append("svg:text")
    // .attr('alignment-baseline','middle')
    .attr('dy',2)
    .attr('text-anchor','middle')
    .attr('font-size',8)    
    .attr('transform','translate(22,7) rotate(0)')
    .text(function(d){return d.target.relation.name})
    .style('fill',function(d){return relationColor(d.target.relation.type)});


link=link.data(graph.links);

link.enter()
    .append('path')
    .attr('class','link');

link
    .attr("class",function(d){return "link "+d.relation})
    .attr("marker-start",function(d){ return d.source.isActive==true?"none":"url(#connector2"+d.source.id+""+d.target.id+")"})
    .attr("marker-end",function(d){ return "url(#connector1"+d.source.id+""+d.target.id+")"});

link.exit().remove();


// Linking Data with nodes.
node=node.data(graph.nodes);

// New or Entering Nodes
nodeEnter=node.enter().append('g')
              .attr('class','logoClass')
              .on('click',nodeclicked)
              .on('dblclick',dblclick)
              .on('mouseenter',function(d){
                                            d3.select(this).select('circle.myCircle').attr('stroke-width',fetchVal(config.strokeWidthHover,d.isActive));
                                            !d.isActive?d3.select(this).select('circle.grayCircle').attr('r',config.radius.inActive+5):0;
                                          })
              .on('mouseleave',function(d){
                                            d3.select(this).select('circle.myCircle').attr('stroke-width',fetchVal(config.strokeWidth,d.isActive));
                                            !d.isActive?d3.select(this).select('circle.grayCircle').attr('r',config.radius.inActive):0;
                                          })
              .call(drag);



// Gray Circle for active componant
nodeEnter.append('circle')
          .attr('class','grayCircle');
node.select('.grayCircle')
          .transition()
          .attr('r',function(d){return d.isActive?config.radius.active+10:1;})
          .attr('fill','rgba(0,0,0,0.2)');
          // .attr('fill',function(d){return d.isActive==true?'rgba(0,0,0,0.2)':'rgba(0,0,0,0)'});

// Bordered Circle
nodeEnter.append("circle")
          .attr("class", "myCircle");
node.select('.myCircle')
          .transition()
          .attr("r", function(d){ return fetchVal(config.radius,d.isActive);})
          .attr('id',function(d){return 'cavatar'+d.id})
          .attr('fill',"white")
          .attr('stroke',function(d){ return relationColor(d.relation.type);})
          .attr('stroke-width',function(d){return fetchVal(config.strokeWidth,d.isActive)});

nodeEnter.append("svg:image")
          .attr('class','avImage');
node.select('.avImage')
          .transition()
          .attr("xlink:href", function(d){return d.img})
          .attr('clip-path',function(d){ return d.isActive?"url(#activeLogo)":"url(#inActiveLogo)"})
          .attr("width", function(d){return fetchVal(config.avatar.radius,d.isActive)})
          .attr("height", function(d){ return fetchVal(config.avatar.radius,d.isActive)})
          .attr("x",function(d){return fetchVal(config.avatar.x,d.isActive)})
          .attr("y",function(d){return fetchVal(config.avatar.y,d.isActive)});

text=nodeEnter.append('text')
          .attr('class','avText');
node.select('.avText')
          .transition()
          .attr('text-anchor','middle')
          .attr('fill',function(d){return  d.isActive==true?relationColor(d.relation.type):"black"})
          .attr('font-size',function(d){ return fetchVal(config.text.size,d.isActive)})
          .attr('y',function(d){return fetchVal(config.text.y,d.isActive)});

text.append('tspan')
    .classed('fName',true);
node.select('.avText').select('.fName')    
    .attr('x',0)
    .attr('dx',0)
    .text(function(d){return d.name.substr(0,d.name.indexOf(' '))});

text.append('tspan')
    .classed('lName',true);
node.select('.avText').select('.lName')
    .attr('x',0)
    .attr('dy',15)
    .text(function(d){
                      var txt=d.name.substr(d.name.indexOf(' ')+1);
                      if(d.isActive){
                        txt+=" ("+d.accounts+")";
                      }
                      return txt;
                    });

// Horizontal Line in Active Componant
nodeEnter.append('line')
         .attr('class','hLine');
node.select('.hLine')  
          .transition()       
         .attr('x1',function(d){ return fetchVal(config.line.x1,d.relation.type)})
         .attr('y1',function(d){ return fetchVal(config.line.y1,d.relation.type)})
         .attr('x2',function(d){ return fetchVal(config.line.x2,d.relation.type)})
         .attr('y2',function(d){ return fetchVal(config.line.y2,d.relation.type)})
         .attr('stroke-width',function(d){ return d.isActive?2:0})
         .attr('stroke',function(d){ return relationColor(d.relation.type)})


nodeEnter.append('text')
          .attr('class','txtWorth');
node.select('.txtWorth')
          .transition()
          .text(function(d){return d.isActive?d.worth:""})
          .attr('text-anchor','middle')
          .attr('x',function(d){ return fetchVal(config.txtWorth.x,d.isActive);})
          .attr('y',function(d){ return fetchVal(config.txtWorth.y,d.isActive);});

// Exiting Nodes
node.exit().remove();



markerLink=markerLink.data(graph.links);

markerLinkEnter=markerLink.enter().append('svg:path')
                          .attr("class",function(d){return "markerLink "+d.relation});                          
                markerLink.attr("marker-end",function(d){ return (d.source.isActive==false&&d.target.isActive==false&&graph.view=='group')?"none":"url(#midMarker"+d.source.id+""+d.target.id+")"})

markerLink.exit().remove();
}










function tick() {
    link.attr("d", function(d) {
        return "M" + 
            d.source.x + "," + 
            d.source.y + "L" +
            d.target.x + "," + 
            d.target.y;
    });
    markerLink.attr("d", function(d) {        
        var x1=d.source.x,
            y1=d.source.y,
            x3=(d.source.x+d.target.x)/2,
            y3=(d.source.y+d.target.y)/2;
            x2=(d.target.x+x3)/2,
            y2=(d.target.y+y3)/2;
            x2=(x2+x3)/2,
            y2=(y2+y3)/2;
    relMarker.selectAll('text')
              .attr('transform',function(d){                              
                              if(d.source.x<d.target.x){
                                return "translate(22,7) rotate(0)"
                              }else{
                                return "translate(22,7) rotate(180)"
                              }
                            });

        return "M" + 
            x1 + "," + 
            y1 + "L" +
            x2 + "," + 
            y2;
    });

node.attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'})

}

function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);  
}


var activeNodeContainer={sourceNode:{},data:[]}
function nodeclicked(d) {//
  $(".breadcrumb").find(".crumb").remove();
  $(".breadcrumb").append('<a href="javascript:;" class="crumb">'+d.name+'</a>');

  if(d.hasChild&&!d.isActive){

//    Code for Restoring Relation back to normal one.
      // if(activeNodeContainer.data.length){
      //   graph.links.forEach(function(item){
      //         if(activeNodeContainer.sourceNode==item.target){
      //           console.log(d3.select('#midMarker'+item.source.id+item.target.id));
      //            var ele=d3.select('#midMarker'+item.source.id+item.target.id).select('text');
      //           ele.text(swapRelation(ele.text()));
      //         }
      //       });
      // }
      if(activeNodeContainer.data.length&&graph.view=='group'){
        var srcNode=activeNodeContainer.sourceNode;
        var collapseNode;
        switch(srcNode.name){
              case "Jane Doe" :graph["janeNode"]=[];collapseNode=graph.janeNode; break;
              case "Joe Dan" :graph["danNode"]=[];collapseNode=graph.danNode; break;
              case "Nita Smith":graph["nitaNode"]=[];collapseNode=graph.nitaNode; break;
              case "Dan Smith":graph["smithNode"]=[];collapseNode=graph.smithNode; break;
          };

          srcNode.isActive=false;
          while(activeNodeContainer.data.length){
            var tempNode=activeNodeContainer.data.pop();
            collapseNode.push(tempNode);
            graph.links.pop();
            graph.nodes.pop();
          }
      }
        updateGraph();
		  
          switch(d.name){
              case "Jane Doe" :clickedNode=graph.janeNode; break;
              case "Joe Dan" :clickedNode=graph.danNode; break;
              case "Nita Smith":clickedNode=graph.nitaNode; break;
              case "Dan Smith":clickedNode=graph.smithNode; break;
          };

          if(Number.isInteger(d.hasChild)&&clickedNode.length>0){
          activeNodeContainer.sourceNode=d;
          d.isActive=true;
          // d3.select(d).select('.lName').text(d.name.indexOf(' ')+1+"("+d.accounts+")");

          for(var i=0;i<d.hasChild;i++){
            var tempNode=clickedNode.pop();         
            tempNode.x=d.x;
            tempNode.y=d.y;   
            activeNodeContainer.data.push(tempNode);
            var tempLink={
              source:d,
              target:tempNode,
              relation:tempNode.relation.type
            }
            graph.nodes.push(tempNode);
            graph.links.push(tempLink);
          }
          }          

          // Clicked Node code for Swap relatoin
        //   if(d.hasChild){
        //     graph.links.forEach(function(item){
        //       if(d==item.target){
        //         console.log(d3.select('#midMarker'+item.source.id+item.target.id));
        //         var ele=d3.select('#midMarker'+item.source.id+item.target.id).select('text');
        //         ele.text(swapRelation(ele.text(),item.source.gender));
        //       }
        //     });
        // }
          updateGraph();
  }
        
        

        if(typeof d.hasChild !='undefined'){          
          graph.nodes.forEach(function(item){
                    item.isActive=false;
                  });
          d.isActive=true;
        updateGraph();
        }
  
 
}


function swapRelation(rel,gender){
  console.log(rel,gender);
  switch(rel){
    case 'Wife'   : return 'Husband';
    case 'Husband': return 'Wife';
    case 'Trustee': return 'Client';
    case 'Client' : return 'Trustee';

    case 'Father' : return gender=='male'?'Son':'Daughter';
    case 'Son'    : return gender=='male'?'Father':'Mother';
    case 'Daughter' : return gender=='male'?'Father':'Mother';
    case 'Mother' : return gender=='male'?'Son':'Daughter';
    default       : return rel;
  }
}

function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
}



function loadGraph(file){
  $(".graphContainer").html("");
  d3.json('json/'+file, function(error,json){renderGraph(json)});
}