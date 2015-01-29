oscar.Util.Plugin.Download.Options = new oscar.BaseClass(
		oscar.Util.Plugin.Download,
		{
			parent:null,
			initialize : function(options) {
				oscar.Util.Plugin.Download.prototype.initialize.apply(this,[ options ]);
			},
			clean:function() {
				this.parent.toggleOptionsMode();
				this.destroy();
			},
			destroy:function() {
				
			},
			/**
			 * @Override
			 * @see oscar.Util.Plugin
			 */
			play : function() {
				this.container = $$("<div></div>");
				this.container.css("width","100%");
				this.container.css("height","100%");
				var scope = this;
				
				var north = $$("<div style='text-align:right'></div>");
				this.$title_panel = $$("<div style='text-align:left'></div>");
				var close_btn = $$("<button></button>").html("close");
				close_btn.css("float","right");
				this.$title_panel.append(close_btn);
				this.$title_panel.css({
					"white-space":"nowrap"
				});
				north.append(this.$title_panel);
				close_btn.button({
					icons: {
						primary: "ui-icon-closethick"
					},
					text: false,
					label:"Close"
				}).click(function(){
					scope.clean();
					
				});
				var center = $$("<div></div>");
				north.addClass("ui-layout-north");
				center.addClass("ui-layout-center");
				this.container.append(north);
				this.container.append(center);
				
				this.content_pane = $$("<div></div>");
				
				center.append(this.content_pane);
				this.content_pane.css({
					"margin-left":"5px",
					"margin-right":"10px",
					"height":"100% !important"
				});
				
				
				
				setTimeout(function(){
				window.onresize=function() {
					scope.internal_layout.resizeAll();
				}
				scope.internal_layout = scope.container.layout({
					resizable:false,
					north: {
						closable:false,
					}
				});
				scope.content_pane.slimScroll({
				"height":"100%"
				});
				},0);
				this.parent.toggleOptionsMode(this.container);
			},
			setTitle:function(str) {
				var tooltip = str;
				if(str.length > 25) {
					str = str.substring(0,25) + "&#8230;"
				}
				var $header = $$("<h2></h2>").html(str);
				$header.attr("title",tooltip);
				$header.tooltip();
				this.$title_panel.append($header);
			},
			addOption:function(jDiv) {
				this.content_pane.append(jDiv);
			},
			CLASS_NAME:"oscar.Util.Plugin.Download.Options"
		});