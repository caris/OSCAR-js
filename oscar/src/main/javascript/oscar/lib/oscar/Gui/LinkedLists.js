oscar.Gui.LinkedLists = new oscar.BaseClass(oscar.Gui,{
	displayClass:"oscarGuiLinkedLists",
	availableText:"",
	selectedText:"",
	initialize:function(options) {
		oscar.Gui.prototype.initialize.apply(this,[options]);
		this.connectionClass=OpenLayers.Util.createUniqueID("connection");
	},
	filter:function() {
		return true;
	},
	draw:function() {
		var sourceId = OpenLayers.Util.createUniqueID("source");
		var destinationId = OpenLayers.Util.createUniqueID("destination");
		
		oscar.Gui.prototype.draw.apply(this);
		var $this = $$(this.div);
		this.sourceDiv = $$("<div></div>");
		this.sourceDiv.addClass("sourceDiv");
		this.sourceTextDiv = $$("<div></div>").html(oscar.i18n(this.availableText));
		this.sourceTextDiv.addClass("sourceText");
		this.navTextDiv = $$("<div></div>").html('&nbsp;');
		this.navTextDiv.addClass("navText");
		this.selectedTextDiv = $$("<div></div>").html(oscar.i18n(this.selectedText));
		this.selectedTextDiv.addClass("selectedText");
		
		this.sourceList = $$("<ul></ul>");
		this.sourceList.addClass(this.connectionClass);
		this.sourceList.attr("id",sourceId);
		this.sourceDiv.append(this.sourceList);
		
		this.buttonsDiv = $$("<div></div>");
		this.buttonsDiv.addClass("buttonsDiv");

		this.destinationDiv = $$("<div></div>");
		this.destinationDiv.addClass("selectedDiv");
		
		this.destinationList = $$("<ul></ul>");
		this.destinationList.attr("id",destinationId);
		this.destinationList.addClass(this.connectionClass);
		
		this.destinationDiv.append(this.destinationList);

		$this.append(this.sourceTextDiv);
		$this.append(this.navTextDiv);
		$this.append(this.selectedTextDiv);
		$this.append("<br clear='left'>");
		$this.append(this.sourceDiv);
		$this.append(this.sourceDiv);
		$this.append(this.sourceDiv);
		$this.append(this.buttonsDiv);
		$this.append(this.destinationDiv);
		
		$this.addClass(this.displayClass);
		this.buildButtons();
		$this.append("<br clear='left'>");
		$this.disableSelection();
		
	},
	buildButtons:function() {
		
		var scope = this;
		this.toTheRight = $$("<button onclick='return false;'></button>").html(oscar.i18n("MoveAllToTheRight"));
		
		this.toTheRight.button({
			icons: {
				primary:"ui-icon-seek-next"
			},
			text:false
		});
		this.toTheRight.click(function() {
			var available = scope.sourceList.children();
			available.each(function() {
				scope.destinationList.append($$(this));
				scope.filter($$(this));
			});
			scope.destinationList.sortable('refresh');
			return false;
		});
		this.toTheRight.css("float","center");
		this.toTheLeft = $$("<button onclick='return false;'></button>").html(oscar.i18n("MoveAllToTheLeft"));
		this.toTheLeft.button({
			icons: {
				primary:"ui-icon-seek-prev"
			},
			text:false
		});
		this.toTheLeft.click(function() {
			var available = scope.destinationList.children();
			available.each(function() {
				scope.sourceList.append($$(this));
				scope.filter($$(this));
			});
			return false;
		});
		this.toTheLeft.css("float","center");
		this.buttonsDiv.append(this.toTheRight);
		this.buttonsDiv.append(this.toTheLeft);
	},
	addToSourceList:function(listItem) {
		var li = $$("<li></li>").html(listItem.text);
		li.attr("title",listItem.text);
		var data = listItem.getData();
		
		for(var p in data) {
			li.data(p,data[p]);
		}

		li.addClass("ui-state-default");
		if(this.filter) {
			this.filter(li);
		}
		if(!this.isSelected(li)) {
			this.sourceList.append(li);
		}
		this.sortable();
		return li;
	},
	addToDestinationList:function(listItem) {
		var li = $$("<li></li>").html(listItem.text);
		li.attr("title",listItem.text);
		var data = listItem.getData();
		
		for(var p in data) {
			li.data(p,data[p]);
		}
		li.addClass("ui-state-default");

		this.destinationList.append(li);
		this.sortable();
		
		return li;
	},
	sortable:function() {
		var scope=this;
		$$(this.sourceList).sortable({
		connectWith:"."+this.connectionClass,
		dropOnEmpty:true,
		cursor: "move",
		receive:function(event,ui) {
			scope.filter(ui.item);
		}
	}).disableSelection();
	
	$$(this.destinationList).sortable({
		connectWith:"."+this.connectionClass,
		dropOnEmpty: true,
		cursor: "move",
		receive:function(event,ui) {
			scope.filter(ui.item);
		}
	}).disableSelection();
	},
	getAvailable:function() {
		return this.sourceList.children();
	},
	getSelected:function() {
		return this.destinationList.children();
	},
	isSelected:function(li) {
		var isFound = false;
		var scope = this;
		this.destinationList.children().each(function() {
			if(scope.compare(li,$$(this))) {
				isFound = true;
			}
		});
		return isFound;
	},
	clearSourceList:function() {
		this.sourceList.empty();
	},
	compare:function(a,b) {
		if(a.html() == b.html())
			return true;
		else 
			return false;
	},
	showHelp:function(str) {
		if(!this.helpDiv) {
			this.helpDiv = $$("<div></div>");
			this.helpDiv.addClass("help2");
			$$(this.div).after(this.helpDiv);
		}
		this.helpDiv.html("");
		this.helpDiv.html(oscar.i18n(str));
		
	},
	CLASS_NAME:"oscar.Gui.LinkedLists"

});
oscar.ListItem = new oscar.BaseClass({
	text:"",
	data:{},
	initialize:function(text,data) {
		this.text=text;
		if(data) {
			this.data = data;
		}
	},
	setData:function(data) {
		this.data = data;
	},
	getData:function(data) {
		return this.data;
	},	
	CLASS_NAME:"oscar.ListItem"
});