inlets = 1;
outlets = 1;

var page = 0;

function Control(v, p, b, pg) {
	this.v = v;
	this.p = p;
	this.b = b;
	this.pg = pg;
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
	
}
	
var Value = function(v, p, b, pg) {
	this.constructor.prototype = Object.create(Control.prototype);
	Control.call(this, arguments);
}

Value.prototype = Object.create(Control.prototype);

Value.prototype.draw = function() {
	if(page == this.pg || -1 == this.pg) {
		var bb = this.b[0].slice();
		bb[v] = this.b[1];
		
		for(var i = 0; i < this.p[0].length; i++) {
			g.led(this.p[0][i], this.p[1], bb[i]);
		}
	}
}

Value.prototype.look = function(x, y, z) {
	
}

var Fader = function(v, p, b, pg) {
	this.constructor.prototype = Object.create(Value.prototype);
	Value.call(this, arguments);
	
	//var value = new Value(v, p, b, pg);
	this.p[0] = [];
	this.b[0] = [];
	
	for(var i = p[0]; i < p[1]; i++) {
		this.p[0][i] = i;
		this.b[0][i] = b[0];
	}
}

Fader.prototype = Object.create(Value.prototype);


Fader.prototype.draw = function() {
	if(page == this.pg || -1 == this.pg) {
		for(var i = 0; i < value.p[0].length; i++) {
			if(i < v) value.b[0][i] = b[2];
			else value.b[0][i] = b[0];
		}
		
		Value.prototype.draw.call(this);
	}
}

Fader.prototype.look = function(x, y, z) {
	
}
