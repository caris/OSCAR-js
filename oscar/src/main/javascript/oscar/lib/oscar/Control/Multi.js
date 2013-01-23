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
 * Class: oscar.Control.Multi This control is the base class for controls which
 * contain a sub-menu with controls.
 * 
 * Inherits from: - <oscar.Control>
 * 
 */

oscar.Control.MultiControl = oscar.BaseClass(oscar.Control, {
	parent : null,
	initialize : function(options) {
		OpenLayers.Control.prototype.initialize.apply(this, [ options ]);

	},
	draw : function() {
		OpenLayers.Control.prototype.draw.apply(this, arguments);

		$$(this.div).dblclick(function(evt) {
			evt.stopPropagation();
		})
		$$(this.div).mousedown(function(evt) {
			evt.stopPropagation();
		})
		$$(this.div).hide();

		$$(this.div).addClass("subMenu");

		var scope = this;
		setTimeout(function() {
			scope.updateSize();
		}, 0)

		var leftBookEnd = $$("<div></div>");
		leftBookEnd.addClass("subMenuBookEnd");
		$$(this.div).append(leftBookEnd);

		return this.div;
	},
	/**
	 * Method: updateSize
	 */
	updateSize : function() {
		var $parent = $$(this.parent.panel_div);
		var $toolbar = $parent.parent();

		var $this = $$(this.div);
		$this.fadeIn();
		var width = 0;
		$this.children().each(function() {
			width += $$(this).outerWidth() + 2;
		})
		$this.width(width);

		var left = $parent.width() / 2;
		left += $toolbar.position().left - width + $parent.position().left;
		$this.css("left", left);
		$this.css("top", $toolbar.position().top + $toolbar.height() + 2);

	},

	addMuliControl : function(elem) {
		var scope = this;
		elem.data("active", false);
		elem.toggleClass("toolInactive");
		elem.click(function() {

			var $this = $$(this);
			$this.parent().children().each(function() {
				var $child = $$(this);
				if ($child.hasClass("toolActive")) {
					$child.removeClass("toolActive");
					$child.addClass("toolInactive");
				}

			})
			$this.removeClass("toolInactive");
			$this.addClass("toolActive");
			var tool = $this.data("tool");
			var ctrl = scope.controls[tool];
			scope.toggleControl(ctrl)
		});
		$$(this.div).append(elem);
	},

	/**
	 * Method: toggleControl
	 * 
	 * Toggles the active control
	 */
	toggleControl : function(ctrl) {
		if (this.popup) {
			this.map.removePopup(this.popup);
		}
		for ( var key in this.controls) {
			var control = this.controls[key];
			control.deactivate();
		}
		ctrl.activate();
		this.activeControl = ctrl;
	},
	CLASS_NAME : "oscar.Control.MultiControl"
});