// Project Endless
// by Jonny Bursa
// April 15, 2020

var screen;
screen.clear = function(color){
	//screen.context.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
	this.context.fillStyle = color;
	this.context.fillRect(0, 0, screen.canvas.width, screen.canvas.height);
}

var keys;
function getkey(k){
	return (keys && keys[k]);
}

var rng;

var mapid = 0;

var tiles = [];

const TILE_SIZE = 400;

var you = {};
// ylt = "your last/current tile"
var ylt = {};
ylt.x = 0;
ylt.y = 0;
var yct = {};
yct.x = 0;
yct.y = 0;

var n = 1;

var tilex = {};
var tiley = {};

// to render a thing, do context.fillStyle=thing.color and context.fillRect(x, y, w, h)
function thing(x, y, size, color){
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
	this.draw = function(){
		screen.context.beginPath();
		screen.context.arc(	screen.canvas.width/2 + this.x - you.x,
							screen.canvas.height/2 + this.y - you.y,
							this.size, 0, 2*Math.PI, false);
		screen.context.fillStyle = this.color;
		screen.context.fill();
		//screen.context.lineWidth = 2;
		//screen.context.strokeStyle = "black";
		//screen.context.stroke();
	};
}

function tile(mapkey, a, b){
	// convention, tile(X,Y) contains x:[x,x+1) y:[y,y+1)
	// so coord 1,1 belongs to tile(1,1)
	// and coord 1,0.9 belongs to tile(1,0)
	this.x = Math.floor(a);
	this.y = Math.floor(b);

	
	this.id = hashtile(mapkey, this.x, this.y);
	//this.id = this.res[0];
	//this.tilex = this.res[1];
	//this.tiley = this.res[2];
	//this.tilez = this.res[3]

	//var p = this.id.length/2;
	
	//var xx = this.id.substr(0, p);
	//var yy = this.id.substr(p);

	var data = [];
	var hashc = 10;
	data[0] = this.id;
	for(var i=1; i<hashc; i++){
		data[i] = md5(data[i-1]);
	}

	this.stuff = [];
	this.stuff[0] = new thing(	(TILE_SIZE/16)*parseInt(data[0][0], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][1], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(0, 2), 16)/8,
								"#"+data[2].substr(0, 8));
	this.stuff[1] = new thing(	(TILE_SIZE/16)*parseInt(data[0][2], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][3], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(2, 2), 16)/8,
								"#"+data[2].substr(8, 8));
	this.stuff[2] = new thing(	(TILE_SIZE/16)*parseInt(data[0][4], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][5], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(4, 2), 16)/8,
								"#"+data[2].substr(16, 8));
	this.stuff[3] = new thing(	(TILE_SIZE/16)*parseInt(data[0][6], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][7], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(6, 2), 16)/8,
								"#"+data[2].substr(24, 8));
	this.stuff[4] = new thing(	(TILE_SIZE/16)*parseInt(data[0][8], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][9], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(8, 2), 16)/8,
								"#"+data[3].substr(0, 8));
	this.stuff[5] = new thing(	(TILE_SIZE/16)*parseInt(data[0][10], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][11], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(10, 2), 16)/8,
								"#"+data[3].substr(8, 8));
	this.stuff[6] = new thing(	(TILE_SIZE/16)*parseInt(data[0][12], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][13], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(12, 2), 16)/8,
								"#"+data[3].substr(16, 8));
	this.stuff[7] = new thing(	(TILE_SIZE/16)*parseInt(data[0][14], 16) + TILE_SIZE*this.x,
								(TILE_SIZE/16)*parseInt(data[0][15], 16) + TILE_SIZE*this.y,
								3+parseInt(data[1].substr(14, 2), 16)/8,
								"#"+data[3].substr(24, 8));

	this.draw = function(){
		for(var i=0; i<this.stuff.length; i++){
			this.stuff[i].draw();
		}
	}
}


var c = 0;
function loop(){

	if(getkey(87) || getkey(38)){
		you.y -= 10;
	}
	if(getkey(83) || getkey(40)){
		you.y += 10;
	}
	if(getkey(65) || getkey(37)){
		you.x -= 10;
	}
	if(getkey(68) || getkey(39)){
		you.x += 10;
	}
	//you.x += 2*(rng.quick()-0.5);
	//you.y += 2*(rng.quick()-0.5);

	// run calcs

	yct.x = Math.floor(you.x/TILE_SIZE);
	yct.y = Math.floor(you.y/TILE_SIZE);
	
	if(yct.x != ylt.x || yct.y != ylt.y){
		for(var i=0; i<9; i++){
			tiles[i] = new tile(mapid, yct.x + (i%3) - 1, yct.y + Math.floor(i/3) - 1);
		}	
	}

	// render scene

	screen.clear("#"+mapid.substr(0,6));

	// Draw Tiles
	for(var i=0; i<9; i++){
		tiles[i].draw();
	}

	you.draw();
	
	document.getElementById("tilex").value = yct.x;
	document.getElementById("tiley").value = yct.y;
	//var res = tile(mapid, tilex, tiley);
	//document.getElementById("tilePX").value = tiles[4].tilex;
	//document.getElementById("tilePY").value = tiles[4].tiley;
	//document.getElementById("tilePZ").value = tiles[4].tilez;
	document.getElementById("TileID").value = tiles[4].id;

	ylt.x = yct.x;
	ylt.y = yct.y;
	c++;
}

function init(){

	//alert("hello");

	// Testing out hash function
	//var hashbuffer = crypto.subtle.digest('SHA-1', new Uint16Array([42]));
	
	//document.getElementById('a').value = hash;
	
	//rng = new Math.seedrandom('abc');


	// Generate a 4-byte random Map ID as hex-encoded string
	mapid = genMapKey();
	document.getElementById('mapid').value = mapid;
	
	screen.canvas = document.createElement("canvas");
	screen.canvas.width = 640;
	screen.canvas.height = 480;
	screen.canvas.backgroundcolor = "cyan";

	screen.context = screen.canvas.getContext("2d");

	document.body.insertBefore(screen.canvas, document.body.childNodes[0]);

	// Set Key Listeners
	window.addEventListener('keydown', function(e){
		keys = (keys || []);
		keys[e.keyCode] = true;
	})
	window.addEventListener('keyup', function(e){
		keys[e.keyCode] = false;
	})

	// Set Map and Things
	you = new thing(0, 0, 10, "blue");

	for(var i=0; i<9; i++){
		tiles[i] = new tile(mapid, (i%3)-1, Math.floor(i/3)-1);
	}

	// Begin Loop
	screen.interval = setInterval(loop, 30);
}
