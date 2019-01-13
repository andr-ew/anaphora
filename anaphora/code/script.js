inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");


var g = grid.connect();

var LO = 7;
var HI = 11;

var pages;

var ALL = -1;
var CUT = 0;
var LVL = 1;
var FADE = 2;
var FB = 3;

var tracks = [];

var Track = function(n) {
	var row = [];
	for(var i = 0; i < 15; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 15; i++) rowb[i] = 0;
	
	
	this.r = new Toggle(0, [0, n], [LO, HI], ALL);
	this.m = new Toggle(0, [1, n], [0, HI], ALL);
	this.p1 = new Toggle(0, [2, n], [0, LO, HI], ALL);
	this.p2 = new Toggle(0, [3, n], [0, LO, HI], ALL);
	this.rev = new Toggle(0, [4, n], [LO, HI], ALL);
	this.s = new Value(3, [[5, 6, 7, 8, 9, 10], n], [[0, 0, 0, LO, 0, 0], HI], ALL);
	this.b = new Value(n, [[11, 12, 13, 14], n], [[0, 0, 0, 0], HI], ALL);
	this.cut = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], CUT);
	this.lvl = new Fader(12, [[0, 14], n + 4], [0, HI, LO], LVL);
	this.fade =  new Value(13, [[1,2,3,4,5,6,7,8,9,10,11,12,13,14], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], FADE);
	this.fb = new Fader(12, [[0, 14], n + 4], [0, HI, LO], FB);
	
	var m = this.m;
	
	this.r.event = function(v) {
		if(v == 0) m.v = 1;
	}
	
	this.p1.event = function(v, last) {
		if(last == 2) {
			this.v = 0;
		}
		else if(v == 0 && last == 1) {
			this.v = 2;
		}
	}
	
	this.p2.event = this.p1.event;
}

g.event = function(x, y, z) {
	if(x < 15) {
		for(i in tracks[y % 4]) {
			tracks[y % 4][i].look(x, y, z);
			tracks[y % 4][i].draw(g);
			
			output(y % 4, i, tracks[y % 4][i].v);
		}
	}
	else {
		pages.look(x, y, z);
		pages.draw(g);
	}

	g.refresh();
}

var redraw = function() {
	g.all(0);
	for(var i = 0; i < tracks.length; i++) {
		for(j in tracks[i]) {
			tracks[i][j].draw(g);
		}
	}
}

var init = function() {	
	pages = new Value(0, [15, [4, 5, 6, 7]], [[0, 0, 0, 0], HI], ALL);
	pages.event = function(v) {
		page = v;
		redraw();
	}
	
	for(var i = 0; i < 4; i++) {
 		tracks[i] = new Track(i);

		for(j in tracks[i]) {
			tracks[i][j].draw(g);
		}
	}
	
	pages.draw(g);
	
	g.refresh();
}