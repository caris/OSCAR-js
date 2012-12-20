/*
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2012 CARIS <http://www.caris.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Class: oscar.Control.ToolBar
 * 
 * The Oscar ToolBar control is a container of other mapping tools which are
 * also controls.
 * 
 * Inherits from: - <OpenLayers.Control.Panel>
 */
oscar.Control.Toolbar = oscar.BaseClass(OpenLayers.Control.Panel, {
	displayMeasurements : true,
	initialize : function(options) {
		OpenLayers.Control.Panel.prototype.initialize.apply(this, [ options ]);
		this.leftCap = $$("<div></div>");
		this.leftCap.addClass("toolBarBookendLeft");
		this.rightCap = $$("<div></div>");
		this.rightCap.addClass("toolBarBookendRight");
	},
	/**
	 * Method: redraw
	 */
	redraw : function() {
		for ( var l = this.div.childNodes.length, i = l - 1; i >= 0; i--) {
			this.div.removeChild(this.div.childNodes[i]);
		}
		this.div.innerHTML = "";
		if (this.active) {
			$$(this.div).append(this.leftCap);
			for ( var i = 0, len = this.controls.length; i < len; i++) {
				this.div.appendChild(this.controls[i].panel_div);
				var tooltipText = oscar.i18n("tooltip_"
						+ this.controls[i].CLASS_NAME.toLowerCase());

				var $panelDiv = $$(this.controls[i].panel_div);
				$panelDiv.attr("title", tooltipText);
				$panelDiv.data("ctrl", this.controls[i]);
				$panelDiv.mouseover(function() {
					var $this = $$(this);
					var ctrl = $this.data("ctrl");

					if (ctrl.active)
						return;

					var displayClass = ctrl.displayClass;
					var active = displayClass + "ItemActive";
					var inactive = displayClass + "ItemInactive";
					$this.removeClass(inactive);
					$this.addClass(active);
				});

				$panelDiv.mouseout(function() {
					var $this = $$(this);
					var ctrl = $this.data("ctrl");

					if (ctrl.active)
						return;

					var displayClass = ctrl.displayClass;
					var active = displayClass + "ItemActive";
					var inactive = displayClass + "ItemInactive";

					$this.addClass(inactive);
					$this.removeClass(active);
				});

			}
			$$(this.div).append(this.rightCap);
		}
	},
	activateControl : function(control) {
		OpenLayers.Control.Panel.prototype.activateControl.apply(this,
				[ control ]);

		for ( var key in this.controls) {
			if (this.controls[key].active && this.controls[key] != control) {
				this.controls[key].deactivate();
			}
		}

	},
	applyTheme : function(theme) {
		this.removeExistingControls();
		var ctrls = [];
		if (this.displayMeasurements) {
			ctrls.push(new oscar.Control.Measure());
		}
		if (theme.hasSelectionService()) {
			var selection = new oscar.Control.Select({
				theme : theme
			});
			ctrls.push(selection);
			this.events.triggerEvent("selection", selection);
		}
		if (theme.hasExtractionService()) {
			ctrls.push(new oscar.Control.DataExtractor(theme));
		}

		this.addControls(ctrls);
	},
	removeExistingControls : function() {
		while (this.controls.length != 0) {
			var control = this.controls.pop();
			control.deactivate();
			this.map.removeControl(control);
		}

	},
	CLASS_NAME : "oscar.Control.ToolBar"
});