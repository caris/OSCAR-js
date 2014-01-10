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

/*
 * WEB-999 - Class added to represent Marker layers (POI layers) in Oscar.
 * WEB-1005 - Added validation rules for MarkerLayers.
 * WEB-1026 - icon, sfs and formatType are optional properties for the MarkerLayer
 */
import com.caris.oscarexchange4j.theme.exceptions.ValidationException;

/**
 * @author tcoburn
 * 
 */
public class MarkerLayer extends Overlay {
    
    public static final String ICON_URI="iconUri";
    public static final String SRS="srs";
    public static final String FORMAT_TYPE="formatType";
    
    /**
     * TYPES - Definition list of supported types for the Marker Layer 
     */
    public static enum TYPES {
        GMLV2, GEORSS, KML, GEOJSON, PICASA, FLICKR, YOUTUBE
    }
    
    /**
     * This method takes in a string and returns a MarkerLayer.TYPES enum.
     * @param type
     * @return
     */
    public static TYPES createTypeFromString(String type) {
        try {
            return MarkerLayer.TYPES.valueOf(type);
        } catch(IllegalArgumentException iae) {
            return MarkerLayer.TYPES.GMLV2;
        }
    }

    public MarkerLayer() {
        this.setLayerType(LayerType.MARKER);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.Overlay#validate()
     */
    /**
     * Validation Rules for MarkerLayer: - icon member is set.
     */
    @Override
    public boolean validate() throws ValidationException {
        super.validate();
        return true;
    }
}
