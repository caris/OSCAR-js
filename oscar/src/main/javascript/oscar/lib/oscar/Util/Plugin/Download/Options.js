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
				var close_btn = $$("<button></button>").html("close");
				north.append(close_btn);
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
				
				this.content_pane = center;
				
				
				setTimeout(function(){
				scope.internal_layout = scope.container.layout({
					resizable:false,
					north: {
						closable:false,
					},
					center: {
					}
				});
				},0);
				this.parent.toggleOptionsMode(this.container);
			},

			addOption:function(jDiv) {
				this.content_pane.append(jDiv);
			},
			CLASS_NAME:"oscar.Util.Plugin.Download.Options"
		});