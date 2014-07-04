oscar.Gui.Wizard = new oscar.BaseClass(oscar.Gui, {
	initialize:function(options) {
		oscar.Gui.prototype.initialize.apply(this,[options]);
	},
	launch:function() {
		if(console) {
			console.log("override this method for your wizard");
		}
	},
	previous:function() {
	},
	next:function() {
		this.step++;
		var fn = this["steps"]["step_"+this.step];
		if(fn) fn.apply(this);
	},
	CLASS_NAME:"oscar.Gui.Wizard"
});

oscar.Gui.Wizard.DirectDownload = new oscar.BaseClass(oscar.Gui.Wizard,{
	protocol:null,
	url:null,
	initialize:function(protocol,url,options) {
		oscar.Gui.Wizard.prototype.initialize.apply(this,[options]);
		this.protocol = protocol;
		this.url = url;
	},

	launch:function() {},
	CLASS_NAME:"oscar.Gui.Wizard.DirectDownload"
});

oscar.Gui.Wizard.WebCoverageServiceDownload = new oscar.BaseClass(oscar.Gui.Wizard,{
	icon:"ui-icon-wcs-download",
	protocol:null,
	url:null,
	initialize:function(protocol,url,options) {
		oscar.Gui.Wizard.prototype.initialize.apply(this,[options]);
		this.protocol = protocol;
		this.url = $$.trim(url);
	},

	launch:function() {
		var database=new oscar.Util.Database();
		database.addTable("sources",["id","title","bbox","abstract","fk_capabilities","dataType"]);
        database.addTable("capabilities",["capabilities"]);
		var params = {
	    	    request:"GetCapabilities",
	    	    service:"WCS",
	    	    version:"1.1.0"
	    }
        var success= function(response) {
        	var reader = new oscar.Format.WCSCapabilities();
            var capabilities = reader.read(response.responseXML);
            var capIndex = database.addRecord("capabilities", {capabilities:capabilities});
            coverages = oscar.Util.Metadata.getCoverages(capabilities);
            for (var c in coverages) {
                var coverage = coverages[c];
                var bbox = new OpenLayers.Bounds(coverage.wgs84BoundingBox.west,
					coverage.wgs84BoundingBox.south,
					coverage.wgs84BoundingBox.east,
					coverage.wgs84BoundingBox.north
				);
				var transformedBounds = bbox.clone();
				transformedBounds.transform(new OpenLayers.Projection("EPSG:4326"),this.map.getProjectionObject());
                var record = {
                	"id":coverage.identifier,
                	"title":coverage.title,
                	"abstract":coverage["abstract"],
                	"bbox":transformedBounds,
                	"fk_capabilities":capIndex,
                	"dataType":"wcs"
                }
                var pk = database.addRecord("sources",record);
            }
        };
		
        this.wcsRequest = OpenLayers.Request.GET( {
            url :this.url,
            params:params,
            async:false,
            success :success,
            scope:this
        });
		//remove an existing data discovery control
		try {
			this.map.getControlsByClass("oscar.Control.DataDiscovery")[0].events.triggerEvent("closed");
		} catch(err) {}

		var title = cswget.title(this.record) || cswget.identifier(this.record);

		this.ctrl = new oscar.Control.DataDiscovery(database,{closable:true,showAbstract:false,query:title});
		this.ctrl.events.on({
			"closed":function() {
				this.map.removeControl(this.ctrl);
			},
			scope:this
		});
		this.map.addControl(this.ctrl);

	},

	CLASS_NAME:"oscar.Gui.Wizard.WebCoverageServiceDownload"
});