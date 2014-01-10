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
 * WEB-999 - Test class for Marker Layers
 * WEB-1026 - Fixed tests based on properties for the MarkerLayer.
 */

import com.caris.oscarexchange4j.OX4J;
import com.caris.oscarexchange4j.theme.LayerType;
import com.caris.oscarexchange4j.theme.MarkerLayer;
import com.caris.oscarexchange4j.theme.Theme;
import com.caris.oscarexchange4j.theme.ThemeLayer;

import junit.framework.TestCase;

/**
 * @author tcoburn
 * 
 */
public class TestMarkerLayer extends TestCase {

    /**
     * Test the display order of Marker Layers. MarkerLayers cannot change their
     * display order. Defaults to -1.
     */
    public void testMarkerLayerDisplayOrder() {
        MarkerLayer ml = new MarkerLayer();
        assertTrue(ml.getDisplayOrder() == -1);
        ml.setDisplayOrder(2);
        assertTrue(ml.getDisplayOrder() == -1);
    }

    /**
     * Test the base layer member of Marker Layers. Marker Layers cannot be base
     * layers (defaults to false) and cannot change the base layer member.
     */
    public void testMarkerLayerBaseLayer() {
        MarkerLayer ml = new MarkerLayer();
        assertTrue(ml.isBaseLayer() == false);
        ml.isBaseLayer(true);
        assertTrue(ml.isBaseLayer() == false);
    }

    /**
     * Test the default layer type of Marker Layers.
     */
    public void testMarkerLayerLayerType() {
        MarkerLayer ml = new MarkerLayer();
        assertTrue(ml.getLayerType() == LayerType.MARKER);
    }

    /**
     * Test to see if the serialization of marker layers work in OXF.
     */
    public void testOXFSerialization() {
        OX4J oxf = new OX4J();
        oxf.addTheme(buildTheme());
        String result = null;
        result = oxf.toJson();
        assertTrue(result.contains("\"iconUri\":\"canoe.png\""));
    }
    
    public void testTypeEnum() {
        String layerType = MarkerLayer.createTypeFromString("KML").toString();
        assertEquals(layerType, "KML");
    }

    public void testTypeEnumDefault() {
        String layerType = MarkerLayer.createTypeFromString("myownformat").toString();
        assertEquals(layerType, "GMLV2");
    }
    
    private Theme buildTheme() {
        Theme t = new Theme();
        t.addLayer(createThemeLayer());
        t.addLayer(createMarkerLayer());
        return t;
    }

    private MarkerLayer createMarkerLayer() {
        MarkerLayer ml = new MarkerLayer();
        ml.setName("Hotels");
        ml.addUrl("http://www.caris.com");
        ml.addParameter(MarkerLayer.ICON_URI, "canoe.png");
        return ml;
    }


    private ThemeLayer createThemeLayer() {
        ThemeLayer tl = new ThemeLayer();
        tl.setName("freddy::land");
        tl.addUrl("http://www.caris.com");
        return tl;
    }

}
