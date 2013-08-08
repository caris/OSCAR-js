/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2013 CARIS <http://www.caris.com>
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

import java.awt.Color;

import com.caris.oscarexchange4j.theme.CoverType;
import com.caris.oscarexchange4j.theme.LayerType;
import com.caris.oscarexchange4j.theme.Theme;
import com.caris.oscarexchange4j.util.serializers.ThemeSerializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Contains static utility methods for the OX library.
 * 
 * @author tcoburn
 * 
 */
public class OXUtil {
	
    /**
     * Returns a com.caris.theme.CoverType object. It will return a DEFAULT
     * CoverType if an error occurs.
     * 
     * @param type
     * @return com.caris.oscarexchange4j.theme.CoverType
     */
    public static CoverType createCoverType(String type) {
        CoverType cType = null;
        try {
            cType = CoverType.valueOf(type);
        } catch (java.lang.IllegalArgumentException e) {
            cType = CoverType.valueOf("DEFAULT");
        }
        return cType;
    }

    /**
     * Returns a com.caris.theme.LayerType object. It will return a WMS
     * LayerType if an error occurs.
     * 
     * @param type
     * @return com.caris.oscarexchange4j.theme.LayerType
     */
    public static LayerType createLayerType(String type) {
        LayerType lType = null;
        try {
            lType = LayerType.valueOf(type);
        } catch (java.lang.IllegalArgumentException e) {
            lType = LayerType.valueOf("WMS");
        }
        return lType;
    }
    
    /**
     * Returns a com.google.gson.Gson object for writing JSON
     * 
     */
    public static Gson createGsonBuilder(boolean prettyPrinting) {
        GsonBuilder g = new GsonBuilder();
        g.registerTypeAdapter(Theme.class, new ThemeSerializer());
        if (prettyPrinting) {
            g.setPrettyPrinting();
        }
        return g.create();
    }
    
    
    /**
     * This method takes a java.awt.Color object and returns a Hex color string.
     * @param color
     * @return String
     */
    public static String ColorToHex(Color color) {
        String hexColor = Integer.toHexString( color.getRGB() & 0x00ffffff ); 
        return checkForZeros(hexColor);
    }
    
    /**
     * This method takes red, green, blue color values and returns a Hex color string.
     * @param red
     * @param green
     * @param blue
     * @return
     */
    public static String RGBToHex(int red, int green, int blue) {
        Color color = new Color(red,green,blue);
        return OXUtil.ColorToHex(color);
    }
    
    private static String checkForZeros(String hexColor) {
        StringBuffer zeros = new StringBuffer();
        int hexColorLength = 6-hexColor.length();
        for(int i = 0;i<hexColorLength;i++) {
            zeros.append("0");
        }
        zeros.append(hexColor);
        return zeros.toString();
    }

	/**
	 * Returns a scale set object based off the name passed in with the
	 * parameters defined.
	 * 
	 * @param wellKnownScaleSet
	 * @return
	 */
	public static ScaleSet getScaleSet(String srs) {
		String tileMatrixSet = getTileMatrixFromEPSG(srs);
		ScaleSet ss = null;
		if (tileMatrixSet.equals(ScaleSet.GoogleMapsCompatible)) {
			ss = new ScaleSet();
			ss.setTileFullExtent(new double[] { -20037508.34, -20037508.34,
					20037508.34, 20037508.34 });
			ss.setTileOrigin(new double[] { -20037508.34, 20037508.34 });
			ss.setTileMatrixSet(ScaleSet.GoogleMapsCompatible);
		} else if (tileMatrixSet.equals(ScaleSet.GlobalCRS84Scale)) {
			ss = new ScaleSet();
			ss.setTileFullExtent(new double[] { -180.00, -90, 180, 90 });
			ss.setTileOrigin(new double[] { -90, 180 });
			ss.setTileMatrixSet(ScaleSet.GlobalCRS84Scale);
		}
		return ss;
	}

	/**
	 * 
	 * @param epsg
	 * @return String returns the TileMatrix based on the epsg code
	 */
	public static String getTileMatrixFromEPSG(String epsg) {
		int code = 0;
		try {
			if (epsg.contains(":")) {
				code = Integer.parseInt(epsg.split(":")[1]);
			} else {
				code = Integer.parseInt(epsg);
			}
		} catch (NumberFormatException nfe) {
			return null;
		} catch (NullPointerException npe) {
			return null;
		}

		return getTileMatrixFromEPSG(code);
	}

	/**
	 * @param epsg
	 * @return String - the name of the TileMatrix based on the epsg code.
	 */
	private static String getTileMatrixFromEPSG(int epsg) {

		switch (epsg) {
		case 900913:
		case 3857:
			return ScaleSet.GoogleMapsCompatible;
		case 4326:
			return ScaleSet.GlobalCRS84Scale;
		default:
			return "EPSG:" + epsg;
		}
	}

	public static String getUrlProtocol(String url) {
		
		return url.substring(0,url.indexOf("//")+2);
	}

}
