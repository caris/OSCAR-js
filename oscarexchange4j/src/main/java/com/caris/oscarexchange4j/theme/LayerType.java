/**
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
package com.caris.oscarexchange4j.theme;

/**
 * This represents a type of Layer
 * @author tcoburn
 *
 */
public enum LayerType {
	WMS,
	WFS,
	GEORSS,
	GOOGLE_PHYSICAL, //G_PHYSICAL_MAP
	GOOGLE_STREETS, //G_NORMAL_MAP
	GOOGLE_SATELLITE, //G_SATELLITE_MAP
	GOOGLE_HYBRID, // G_HYBRID_MAP
	MARKER, //POIs
	SELECTION,
	OSM ,//Open Street Map
	WMTS //Web Map Tiling Service
}
