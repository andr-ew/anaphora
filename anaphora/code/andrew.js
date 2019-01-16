inlets = 1;
outlets = 1;

var page = 0;

function Control(v, p, b, pg) {
	this.v = v;
	this.p = p;
	this.b = b;
	this.pg = pg;
	this.event = function() {}
}

Control.prototype.draw = function(g) {}
Control.prototype.look = function() {}

var Toggle = function(v, p, b, pg) {
	Control.call(this, v, p, b, pg);
}

Toggle.prototype = Object.create(Control.prototype);

Toggle.prototype.draw = function(g) {
	if(page == this.pg || -1 == this.pg) {	
		//post(this.p[0], this.p[1], this.b[this.v])
		g.led(this.p[0], this.p[1], this.b[this.v]);
	}
}
	
Toggle.prototype.look = function(x, y, z) {
	if(page == this.pg || -1 == this.pg) {
		if(x == this.p[0] && y == this.p[1]) {
			if(z == 0) {
				var last = this.v;
				this.v = Math.abs(this.v - 1)
				this.event(this.v, last);
			}
		}
	}
}

var Momentary = function(v, p, b, pg) {
	Toggle.call(this, v, p, b, pg);
}

Momentary.prototype = Object.create(Toggle.prototype);

Momentary.prototype.look = function(x, y, z) {
	if(page == this.pg || -1 == this.pg) {
		if(x == this.p[0] && y == this.p[1]) {
			var v = z
			this.event(v);
			this.v = v;
		}
	}
}
	
var Value = function(v, p, b, pg) {
	Control.call(this, v, p, b, pg);
}

Value.prototype = Object.create(Control.prototype);

Value.prototype.draw = function(g) {
	if(page == this.pg || -1 == this.pg) {
		var bb = this.b[0].slice();
		bb[this.v] = this.b[1];
		
		if(this.p[0].length) {
			for(var i = 0; i < this.p[0].length; i++) {
				g.led(this.p[0][i], this.p[1], bb[i]);
			}
		} 
		else {
			
			for(var i = 0; i < this.p[1].length; i++) {
				g.led(this.p[0], this.p[1][i], bb[i]);
			}
		}
	}
}

Value.prototype.look = function(x, y, z) {
	if(page == this.pg || -1 == this.pg) {
		if(this.p[0].length) {
			if(y == this.p[1]) {
				for(var i = 0; i < this.p[0].length; i++) {
					if(this.p[0][i] == x && z == 1) {
						var v = x - this.p[0][0]
						this.event(v);
						this.v = v;
					}
				}
			}
		}
		else {
			if(x == this.p[0]) {
				for(var i = 0; i < this.p[1].length; i++) {
					if(this.p[1][i] == y) {
						var v = y - this.p[1][0]
						this.event(v);
						this.v = v;
					}
				}
			}
		}
	}
}

var Fader = function(v, p, b, pg) {
	Value.call(this, v, p, b, pg);
	
	this.pp = p[0].slice();
	this.bb = b[0];
	
	//var value = new Value(v, p, b, pg);
	this.p[0] = [];
	this.b[0] = [];
	
	for(var i = this.pp[0]; i <= this.pp[1]; i++) {
		this.p[0][i] = i;
		this.b[0][i] = this.bb;
	}
}

Fader.prototype = Object.create(Value.prototype);


Fader.prototype.draw = function(g) {
	if(page == this.pg || -1 == this.pg) {
		if(this.p[0].length) {
			for(var i = 0; i < this.p[0].length; i++) {
				if(i < this.v) this.b[0][i] = this.b[2];
				else this.b[0][i] = this.bb;
			}
		}
		else {
			for(var i = 0; i < this.p[1].length; i++) {
				if(i < this.v) this.b[0][i] = this.b[2];
				else this.b[0][i] = this.bb;
			}
		}
		Value.prototype.draw.call(this, g);
	}
}

var Crossfader = function(v, p, b, pg) {
	Fader.call(this, v, p, b, pg);
}

Crossfader.prototype = Object.create(Fader.prototype);

Crossfader.prototype.draw = function(g) {
	if(page == this.pg || -1 == this.pg) {
		if(this.p[0].length) {
			for(var i = 0; i < this.p[0].length; i++) {
				if((i > this.v && i <= Math.round(this.p[0].length - 1) / 2) || (i < this.v && i >= Math.round(this.p[0].length - 1) / 2)) this.b[0][i] = this.b[2];
				else this.b[0][i] = this.bb;
			}
		}
		else {
			for(var i = 0; i < this.p[1].length; i++) {
				if((i > this.v && i <= this.p[0].length / 2) || (i < this.v && i >= this.p[0].length / 2)) this.b[0][i] = this.b[2];
				else this.b[0][i] = this.bb;
			}
		}
		Value.prototype.draw.call(this, g);
	}
}

var Pattern = function(b, f) {
	var time = 0;
	var r = 0;
	
	var pattern = {}
		
	var task = new Task(function() {
		if(time > 0) {
			for(t in pattern) {
				if((arguments.callee.task.iterations % time) == t) {
					f.apply(null, pattern[t]);//---------------------
				}
			}
		}
	}, this);
	task.interval = 1;
	
	var b = b;
	
	b.event = function(v, last) {
		if(last == 2) {
			this.v = 0;
			
			time = 0;
			r = 0;
			pattern = {}
			task.cancel();
		}
		else if(v == 0 && last == 1) {
			this.v = 2;
			
			time = task.iterations;
			r = 0;
			task.cancel();
			task.repeat();
		}
		else if(v == 1 && last == 0) {
			r = 1;
			task.repeat();
		}
	}
	
	this.look = function() {
		if(r && !(arguments[0] == b.p[0] && arguments[1] == b.p[1])) {
			pattern[task.iterations] = arguments;
		}
	}
}