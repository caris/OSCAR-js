/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2014 CARIS <http://www.caris.com>
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

import com.caris.oscarexchange4j.theme.exceptions.ValidationException;
import com.caris.oscarexchange4j.util.OXUtil;
import com.caris.oscarexchange4j.util.ScaleSet;

/**
 * @author tcoburn
 * 
 */

public class WMTS extends ThemeLayer {

	/**
	 * Valid encodings for a WMTS layer
	 */
	public static final String KVP = "KVP";
	public static final String REST = "REST";

	/**
	 * Upper left starting point for the tiles.
	 */
	private double[] tileOrigin;

	/**
	 * The full coverage area for the tile set.
	 */
	private double[] tileFullExtent;
	/**
	 * Default request type.
	 */
	private String requestType = WMTS.REST;
		
	/**
	 * The tile matrix set
	 */
	private String tileMatrixSet;

	/**
	 * Constructor Sets the layer type to LayerType.WMTS
	 */
	public WMTS() {
		this.setLayerType(LayerType.WMTS);
	}

	/**
	 * @deprecated - Use new WMTS(url,requestType)
	 * @param url
	 *            - Source URL
	 * @param layerName
	 *            - Layer name or Theme name
	 * @param requestType
	 *            - REST or KVP (Key Value Pair)
	 * @param srs
	 *            - EPSG code
	 */
	public WMTS(String url, String layerName, String requestType, String srs,
			String format) {
		this.setLayerType(LayerType.WMTS);
		this.addUrl(url);
		this.setName(layerName);
		this.requestType = requestType;
		DataLayer dataLayer = new DataLayer();
		dataLayer.setLayerName(layerName);
		this.addDataLayer(dataLayer);
		this.setFormat(format);
		this.setSRS(srs);
	}
	public WMTS(String url,String requestEncoding) {
		this.setLayerType(LayerType.WMTS);
		this.addUrl(url);
	}
	/**
	 * 
	 * @param srs Uses the SRS to determine the tile origin and the full extent.
	 */
	public void setSRS(String srs) {
		ScaleSet scaleSet = OXUtil.getScaleSet(srs);
		this.setTileOrigin(scaleSet.getTileOrigin());
		this.setTileFullExtent(scaleSet.getTileFullExtent());
		this.setTileMatrixSet(scaleSet.getTileMatrixSet());
	}

	/**
	 * @param requestType
	 *            Sets the request type KVP or REST
	 */
	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}

	/**
	 * @return String - The request type. KVP or REST.
	 */
	public String getRequestType() {
		return requestType;
	}

	/**
	 * @param tileMatrixSet
	 * Sets the tile matrix set to use.
	 */
	public void setTileMatrixSet(String tileMatrixSet) {
		this.tileMatrixSet = tileMatrixSet;
	}

	/**
	 * @return - The name of the tile matrix set.
	 */
	public String getTileMatrixSet() {
		return tileMatrixSet;
	}
	
	/**
	 * 
	 * @return Retuns the origin position of the first tile.
	 */
	public double[] getTileOrigin() {
		return tileOrigin.clone();
	}

	/**
	 * @param tileOrigin
	 *            Sets the origin position of the first tile.
	 */
	public void setTileOrigin(double[] tileOrigin) {
		this.tileOrigin = tileOrigin.clone();
	}

	/**
	 * @return double[] sets the overall extent
	 * 
	 */
	public double[] getTileFullExtent() {
		return tileFullExtent.clone();
	}

	/**
	 * @param tileFullExtent
	 *            Sets the over all extent
	 */
	public void setTileFullExtent(double[] tileFullExtent) {
		this.tileFullExtent = tileFullExtent.clone();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.caris.oscarexchange4j.theme.ThemeLayer#validate()
	 */
	/**
	 * Validation Rules for WMTS layer
	 * 
	 */
	@Override
	public boolean validate() throws ValidationException {
		String tileMatrixSet = this.getTileMatrixSet();
		if (tileMatrixSet == null || tileMatrixSet.length() == 0)
			throw new ValidationException("TileMatrixSet is null or is empty");
		if (this.tileFullExtent == null || this.tileFullExtent.length != 4) {
			throw new ValidationException(
					"TileFullExtent is null or does not contain 4 values.");
		}
		if (this.tileOrigin == null || this.tileOrigin.length != 2) {
			throw new ValidationException(
					"TileOrigin is null or does not contain 2 values.");
		}
		return super.validate();
	}



}
