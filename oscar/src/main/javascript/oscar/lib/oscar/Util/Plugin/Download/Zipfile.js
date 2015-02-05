oscar.Util.Plugin.Download.Zipfile = new oscar.BaseClass(oscar.Util.Plugin.Download, {
    pluginType : "application/zip",
    icon : "ui-icon-disk",
    initialize : function(options) {
        oscar.Util.Plugin.Download.prototype.initialize.apply(this, [ options ]);

    },

    /**
     * @Override
     * @see oscar.Util.Plugin
     */
    play : function() {
        var elemIF = document.createElement("iframe");
        elemIF.src = this.link.url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    },
    CLASS_NAME : "oscar.Util.Plugin.Download.Zipfile"
});

oscar.getPluginManager().register(oscar.Util.Plugin.Download.Zipfile.prototype.pluginType, oscar.Util.Plugin.Download.Zipfile);