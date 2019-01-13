inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");


var g = grid.connect();

var LO = 7;
var HI = 11;

var ALL = -1;
var CUT = 0;
var LVL = 1;
var FADE = 2;
var FB = 3;

var tracks = [];

var Track = function(n) {
	var row = [];
	for(var i = 0; i < 16; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 16; i++) rowb[i] = 0;
	
	this.r = new Toggle(0, [0, n], [LO, HI], ALL);
	//this.m = new Toggle(0, [1, n], [0, HI], ALL);
	//this.p1 = new Toggle(0, [2, n], [0, HI], ALL);
	//this.p2 = new Toggle(0, [3, n], [0, HI], ALL);
	this.rev = new Toggle(0, [4, n], [LO, HI], ALL);
	this.s = new Value(3, [[5, 6, 7, 8, 9, 10], n], [[0, 0, 0, LO, 0, 0], HI], ALL);
	//this.b = new Value(n, [[11, 12, 13, 14], n], [[0, 0, 0, 0], HI], ALL);
	//this.cut = new Value(0, [row, n], [rowb, HI], CUT);
	//this.lvl = new Fader(0, [[0, 15], n], [0, HI, LO], LVL);
	//this.fade =  new Value(0, [row, n], [rowb, HI], FADE);
	//this.fb = new Fader(0, [[0, 13], n], [0, HI, LO], FB);
}

var update = function(x, y, z) {
	for(i in tracks[y % 4]) {
		//interface.look(x, y, z);
		 tracks[y % 4][i].draw(g);
	}

	g.refresh();
}

var init = function() {	
	page = 0;
	
	for(var i = 0; i < 4; i++) {
 		tracks[i] = new Track(i);

		for(j in tracks[i]) {
			tracks[i][j].draw(g);
		}
	}
	
	g.refresh();
}

g.event = update;