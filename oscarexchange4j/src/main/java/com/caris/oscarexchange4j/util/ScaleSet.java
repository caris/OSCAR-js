/**
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2011 CARIS <http://www.caris.com>
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

package com.caris.oscarexchange4j.util;

/**
 * @author tcoburn Class used for WMTS layers to contain some parameter data.
 * 
 */
public class ScaleSet {

	/** Well Known Scale Sets **/
	public static final String GoogleMapsCompatible = "GoogleMapsCompatible";
	public static final String GlobalCRS84Scale = "GlobalCRS84Scale";
	
	/**
	 * The name of the scale set.
	 */
	private String tileMatrixSet;
	
	/**
	 * The coordinates for the top-left corner
	 */
	private double[] tileOrigin=null;
	/**
	 * The world cover.
	 */
	private double[] tileFullExtent=null;

	/**
	 * Sets the name of the scale set to be used.
	 * @param tileMatrixSet
	 */
	public void setTileMatrixSet(String tileMatrixSet) {
		this.tileMatrixSet = tileMatrixSet;
	}

	/**
	 * 
	 * @return String The name of the scale set.
	 */
	public String getTileMatrixSet() {
		return tileMatrixSet;
	}
	/**
	 * @return double[] The top-left corner.
	 */
	public double[] getTileOrigin() {
		return tileOrigin.clone();
	}

	/**
	 * Sets the top-left corner
	 * 
	 * @param tileOrigin
	 */
	public void setTileOrigin(double[] tileOrigin) {
		this.tileOrigin = tileOrigin.clone();
	}

	/**
	 * @return double[] The world cover.
	 */
	public double[] getTileFullExtent() {
		return tileFullExtent.clone();
	}

	/**
	 * Sets the world cover
	 * 
	 * @param tileFullExtent
	 */
	public void setTileFullExtent(double[] tileFullExtent) {
		this.tileFullExtent = tileFullExtent.clone();
	}

}
