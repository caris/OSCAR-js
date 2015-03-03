oscar.Util.Parser = new oscar.BaseClass({
	EVENT_TYPES:['parseerror','parsesuccess'],
	events:null,
	initialize:function(parser) {
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES, false);
		this.parser = parser;
		this.parser.yy.parseError = $$.proxy(this.parseError,this);
	},
	parse:function(str) {
		this.parser.parse(str);
		this.events.triggerEvent('parsesuccess',str);
	},	
	parseError:function(msg,hash) {
		this.events.triggerEvent('parseerror',hash);
		throw new oscar.Util.ParserError('parser error', hash);
	},
	CLASS_NAME:"oscar.Util.Parser"
});

oscar.Util.ParserError = function(msg,hash) {
	this.msg = msg;
	this.hash = hash;

},
oscar.Util.ParserError.prototype = new Error;
