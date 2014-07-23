/**
 * Class: oscar.Format.CSW
 * 
 * The base CSW format class.
 */

oscar.Format.CSW = new oscar.BaseClass(
		OpenLayers.Format.XML,
		{
			initialize : function(options) {
				OpenLayers.Format.prototype.initialize.apply(this, [ options ]);
				this.options = options;
			},

			read : function(data) {
				if (typeof data == "string") {
					data = OpenLayers.Format.XML.prototype.read.apply(this,
							[ data ]);
				}
				var root = data.documentElement;
				var version = this.version || root.getAttribute("version")
						|| this.defaultVersion;
				var rootNodeName = root.nodeName;
				var constr = this.findConstructor(root.nodeName, version);
				if (!constr) {
					throw "Cannot find a CSW " + root.nodeName
							+ " parser for version " + version;
				}
				var parser = new constr(this.options);
				var obj = parser.read(data);
				obj.version = version;
				return obj;
			},
			findConstructor : function(operationType, version) {
				try {
					return oscar.Format.CSW["v" + version.replace(/\./g, "_")][operationType];
				} catch (err) {
					return null;
				}

			},
			CLASS_NAME : "oscar.Format.CSW"
		});