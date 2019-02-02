inlets = 1;
outlets = 1;

include("grid.js");
include("andrew.js");

var g = grid.connect();

var LO = 7;
var HI = 11;

var controls = {}
controls.tracks = [];

var pager;

var update = function(h, i, j, v) {
	if (controls[h][i][j].v != v) {
		controls[h][i][j].event(v);
		controls[h][i][j].v = v;
		
		output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
	}
	
	controls[h][i][j].draw(g);
	
	g.refresh();
}


g.event = function(x, y, z) {
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].look(x, y, z)) {
					for(l in controls[h][i]) {
						if(!(controls[h][i][j].ispattern) && controls[h][i][l].ispattern) {
							controls[h][i][l].store(h, i, j, controls[h][i][j].v);
						}
					}
					
					output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
				}
				
				controls[h][i][j].draw(g);
			}
		}
	}
	
	pager.look(x, y, z);
	pager.draw(g);
	
	g.refresh();
}

var redraw = function() {
	g.all(0);
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].draw) controls[h][i][j].draw(g);
				//output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
			}
		}
	}
	
	pager.draw(g);
}

var refresh = function() {
	g.all(0);
	for(h in controls) {
		for(var i = 0; i < controls[h].length; i++) {
			for(j in controls[h][i]) {
				if(controls[h][i][j].draw) controls[h][i][j].draw(g);
				output(h, i, j, controls[h][i][j].output(controls.tracks[i][j].v));
			}
		}
	}
	
	pager.draw(g);
}

input["tracks"] = function(n) {
	if(n[0] == "pos") {
		if(1) {
			controls.tracks[n[1]].cut.v = n[2];
			controls.tracks[n[1]].cut.draw(g);
			
			//if(n[0] == 0)
	 		g.refresh();
		}
	}
	else if(n[0] == "m") {
		controls.tracks[n[1]].m.v = n[2];
		controls.tracks[n[1]].m.draw(g);
		output("tracks", n[1], "m", controls.tracks[n[1]].m.output(controls.tracks[n[1]].m.v));
		
		refresh();
		g.refresh();
	}
}

var Track = function(n, pg1, pg2, buffg) {
	var row = [];
	for(var i = 0; i < 7; i++) row[i] = i;
	var rowb = [];
	for(var i = 0; i < 7; i++) rowb[i] = 0;
	
	//this.n = n;
	this.r = new Toggle(0, [0, n], [LO, HI], pg1);
	this.m = new Toggle(0, [1, n], [0, HI], pg1);
	this.p1 = new Pattern(0, [2, n], [0, LO, HI], pg1, update);
	this.p2 = new Pattern(0, [3, n], [0, LO, HI], pg1, update);
	this.rev = new Toggle(0, [4, n], [LO, HI], pg1);
	this.s = new Value(3, [[5, 6, 7, 8, 9, 10], n], [[0, 0, 0, LO, 0, 0], HI], pg1);
	this.s.output = function(v) { return v - 3; }
	
	this.b = new Value(n, [[11, 12, 13, 14], n], [[0, 0, 0, 0], HI], pg1);
	
	this.cut = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	this.cut.look = function() {};
	
	this.jump = new Value(-1, [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], n + 4], [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], HI], pg2);
	this.jump.draw = function() {}
		
	this.lvl = new Fader(13, [[0, 15], n + 4], [0, HI, LO], function() { return pager.v == 1; });
	this.lvl.output = function(v) { return v / 13; }
		
	this.pan = new Crossfader(7, [[0, 14], n + 4], [0, HI, LO], function() { return pager.v == 2; });
	this.pan.output = function(v) { return v / 14; }
		
	this.fb = new Fader(0, [[0, 10], n + 4], [0, HI, LO], function() { return pager.v == 3; });
	this.fb.output = function(v) { return v / 10; }
		
	this.route = new Value(n, [[11, 12, 13, 14], n + 4], [[0,0,0,0], HI], function() { return pager.v == 3; });
	
}

var init = function() {	
	pager = new Value(0, [15, [0, 1, 2, 3]], [[LO, LO, LO, LO], HI], function() { return 1 }); 
	pager.event = function(v) {
		this.v = v;
		
		redraw();
	}
	
	for(var i = 0; i < 4; i++) {
 		controls.tracks[i] = new Track(i, function() { return 1; }, function() { return pager.v == 0; }, [0,1,2,3]);
		
		for(j in controls.tracks[i]) {
			if(controls.tracks[i][j].draw) {
				controls.tracks[i][j].draw(g);
				
				output(i, j, controls.tracks[i][j].output(controls.tracks[i][j].v));
			}
		}
	}
	
	pager.draw(g);

	g.refresh();
}