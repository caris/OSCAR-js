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
/*
 * WEB-1005 Tests added to verify layers added and oxf outputs correctly.
 * WEB-1026 - Fixed tests based on properties for the MarkerLayer.
 */
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.caris.oscarexchange4j.OX4J;

import junit.framework.TestCase;

/**
 * @author tcoburn
 * 
 */
public class TextOX4J extends TestCase {

    public void testOX4JtoJson() {
        OX4J ox = new OX4J();
        ox.addTheme(createTheme());
        String result = ox.toJson();
        System.out.println(result);
        assertTrue(result.contains("srs"));
        assertEquals(ox.getThemes().size(),1);

    }

    private Theme createTheme() {
        Theme theme = new Theme();
        theme.setSRS("EPSG:4326");
        theme.setCovers(getCovers());
        theme.setDisplayOrder(1);
        theme.setId(1);
        theme.setLayers(getThemeLayers());
        return theme;
    }

    private List<ThemeLayer> getThemeLayers() {
        List<ThemeLayer> layers = new ArrayList<ThemeLayer>();
        layers.add(getBasicThemeLayer());
        layers.add(getMarkerLayer());
        layers.add(getSelectionLayer());
        return layers;
    }

    private ThemeLayer getBasicThemeLayer() {
        ThemeLayer layer = new ThemeLayer();
        layer.setName("base layer");
        layer.isBaseLayer(true);
        layer.addUrl("http://www.caris.com");
        layer.addDataLayer(new DataLayer("Land"));
        return layer;
    }

    private ThemeLayer getMarkerLayer() {
        MarkerLayer layer = new MarkerLayer();
        layer.setName("poi");
        layer.addUrl("http://www.caris.com");
        layer.addDataLayer(new DataLayer("Hotels"));
        return layer;
    }

    private ThemeLayer getSelectionLayer() {
        SelectionLayer layer = new SelectionLayer();
        layer.setName("poi");
        layer.addUrl("http://www.caris.com");
        layer.setWFSVersion("1.0.0");
        layer.setResponseFormat("GML2");
        layer.addDataLayer(new DataLayer("Buildings"));
        return layer;
    }

    private Set<Cover> getCovers() {
        Set<Cover> covers = new HashSet<Cover>();
        Cover defaultCover = new Cover();
        defaultCover.setType(CoverType.DEFAULT);
        defaultCover.setMaxX(180);
        defaultCover.setMaxY(90);
        defaultCover.setMinX(-180);
        defaultCover.setMinY(-90);

        Cover maxCover = new Cover();
        maxCover.setType(CoverType.MAX);
        maxCover.setMaxX(180);
        maxCover.setMaxY(90);
        maxCover.setMinX(-180);
        maxCover.setMinY(-90);

        covers.add(defaultCover);
        covers.add(maxCover);

        return covers;
    }

}
