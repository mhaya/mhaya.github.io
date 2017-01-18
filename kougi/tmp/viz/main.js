var width = parseInt(d3.select("#svg").style("width"));
var height = parseInt(d3.select("#svg").style("height"));
var show_img_x = 5;
var show_img_y = 2;
var img_width = width/show_img_x;
var img_height = height/show_img_y;

// 画像リスト
var images = [
    {img: 'hit01.png'},
    {img: 'hit02.png'},
    {img: 'hit03.png'},
    {img: 'hit04.png'},
    {img: 'hit05.png'},
    {img: 'hit06.png'},
    {img: 'hit07.png'},
    {img: 'hit08.png'},
    {img: 'hit09.png'},
    {img: 'hit10.png'}
];

// 画像の座標算出
for (i in images){
    images[i].id = i;
    images[i].x = img_width*(i%show_img_x);
    images[i].y = img_height*Math.floor(i/show_img_x);
}

var svg = d3.select("#svg")
    .append("svg").attr("width",width).attr("height",height);

var color = d3.schemeCategory10;
var len = 1000;

// 最前面に移動するようにメソッドを追加
d3.selection.prototype.moveToFront =
    function() {
        return this.each(function(){this.parentNode.appendChild(this);});
    };


var all_messages = new Array();
d3.csv("input.csv", function(error, data){
    if (error != null) {
      console.log(err);
      return;
    }
    
    for (i in images){
    // 画像番号でフィルタ
	var messages = data.filter(function(a){
	    var tmp = a.id -1
	    if(tmp == i){
		    return a;
		}
	});
	all_messages.push(messages);
    }
});

svg.selectAll('cell')
    .data(images)
    .enter()
    .append('image')
    .attr('id',function(d){return "img"+d.id;})
    .attr('xlink:href',function(d){return d.img})
	.attr('width',img_width)
	.attr('height',img_height)
	.attr('x',function(d){return d.x;})
    .attr('y',function(d){return d.y;})
    .on('mouseover',function(d){
	    d3.select(this)
		.moveToFront()
		.transition()
		.delay(0)
		.duration(200)
		.attr('width',width)
		.attr('height',height)
		.attr('x',0)
		.attr('y',0)
		.transition()
		.delay(1000)
		.duration(100)
		.attr('width',img_width)
		.attr('height',img_height)
		.attr('x', function(d){return img_width*(d.id%show_img_x);})
	    .attr('y',function(d){return img_height*Math.floor(d.id/show_img_x);});

	// 文章を乱数で決定
	var msg = all_messages[d.id];
	var num = Math.floor(Math.random()*msg.length);

	d3.select("#text")
	    .moveToFront()
	    .text(msg[num].text)
	    .attr('fill','white')
	    .attr('x',width/2)
	    .attr('y',height/2)
	    .attr('text-anchor','middle')
	    .transition().
	    delay(0)
	    .duration(1000)
	    .attr('opacity',1)
	    .transition()
	    .delay(0)
	    .duration(1000)
	    .attr('opacity',0);
    });
svg.append('text')
    .attr('id','text')
    .attr('class','text');


