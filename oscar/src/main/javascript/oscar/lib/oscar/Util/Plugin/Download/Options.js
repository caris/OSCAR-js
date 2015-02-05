oscar.Util.Plugin.Download.Options = new oscar.BaseClass(
		oscar.Util.Plugin.Download,
		{
			EVENT_TYPES:['enterMode','exitMode'],
			parent:null,
			initialize : function(options) {
				oscar.Util.Plugin.Download.prototype.initialize.apply(this,[ options ]);
				this.events.on({
					"enterMode":function() {
						this.mode_container.show('slide',
						{direction:"left"},
						500);
					},
					"exitMode":function() {
						var scope = this;
						this.mode_container.hide('slide',
						{direction:"left"},
						500,$$.proxy(function(){
							this.mode_container.empty();
						},this));
					},
					scope:this
				});
			},
			destroy:function() {
				this.events.triggerEvent("exitMode");
				
			},
			/**
			* @Override
			* @see oscar.Util.Plugin
			*/
			play : function() {
				this.events.triggerEvent("enterMode",this);
				var scope = this;
				this.container = $$("<div></div>");
				this.container.addClass("options-mode-container");
				this.container.css("width","100%");
				this.container.css("height","100%");

				this.mode_container.append(this.container);
				
				var scope = this;
				
				var north = $$("<div></div>");
				var title_panel = $$("<div></div>");
				this.$title=$$("<h2></h2>").html("&nbsp;");
				var btn_panel = $$("<div></div>");
				btn_panel.css({
					"float":"right"
				});
				var close_btn = $$("<button></button>").html("close");
				btn_panel.append(close_btn);
				title_panel.append(btn_panel);
				title_panel.append(this.$title);
				north.append(title_panel);
				close_btn.button({
					icons: {
						primary: "ui-icon-closethick"
					},
					text: false,
					label:"Close"
				}).click(function(){
					scope.destroy();
				});
				var center = $$("<div></div>");
				north.addClass("ui-layout-north");
				north.css("padding","5px");
				center.addClass("ui-layout-center");
				center.css("padding","5px");
				this.container.append(north);
				this.container.append(center);
				
				this.content_pane = $$("<div></div>");
				this.content_pane.addClass("coverage-mode-content");
				
				center.append(this.content_pane);
				this.content_pane.css({
					"margin-left":"5px",
					"margin-right":"10px",
					"height":"100% !important"
				});
				this.layout = this.container.layout();
				$$(window).resize($$.proxy(function(){
					this.layout.resizeAll();
				},this));
				var scope = this;

				this.content_pane.slimScroll({
					"height":"100%"
				});
			},
			setTitle:function(str) {
				this.$title.html(str);
			},
			addOption:function(jDiv) {
				this.content_pane.append(jDiv);
			},
			CLASS_NAME:"oscar.Util.Plugin.Download.Options"
		});