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

package com.caris.oscarexchange4j.theme;

/*
 * WEB-1005 Test added to cover Theme creation and verify validation rules when adding layer types.
 * SFV-96 Needed to add an equals as part of some viewer cleanup.
 */
import java.awt.Color;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Test;

import junit.framework.TestCase;

/**
 * Test class to test adding various layer types to Theme objects.
 * 
 * @author tcoburn
 * 
 */
public class TestTheme extends TestCase {

    /**
     * Test adding a basic ThemeLayer ThemeLayers require at least 1 source url,
     * a name and layerType.
     */
    @Test
    public void testThemeAddThemeLayer() {
        Theme theme = new Theme();
        ThemeLayer tl = createThemeLayer();
        theme.addLayer(tl);
        assertEquals(theme.getLayers().size(), 1);
    }

    /**
     * @return
     */
    @Test
    private ThemeLayer createThemeLayer() {
        ThemeLayer tl = new ThemeLayer();
        tl.addUrl("http://www.caris.com");
        tl.setName("CARIS World Layer");
        tl.setLayerType(LayerType.WMS);
        return tl;
    }

    /**
     * Test adding a MarkerLayer
     */
    @Test
    public void testThemeAddMarkerLayer() {
        Theme theme = new Theme();
        MarkerLayer ml = createMarkerLayer();
        theme.addLayer(ml);
        assertEquals(theme.getLayers().size(), 1);
    }

    /**
     * @return
     */
    @Test
    private MarkerLayer createMarkerLayer() {
        MarkerLayer ml = new MarkerLayer();
        ml.addUrl("http://www.caris.com");
        ml.setName("CARIS World Map");
        return ml;
    }

    /**
     * Test adding a SelectionLayer
     */
    @Test
    public void testThemeAddSelectionLayer() {
        Theme theme = new Theme();
        SelectionLayer sl = createSelectionLayer();
        theme.addLayer(sl);
        assertEquals(theme.getLayers().size(), 1);
    }

    /**
     * @return
     */
    @Test
    private SelectionLayer createSelectionLayer() {
        SelectionLayer sl = new SelectionLayer();
        sl.addUrl("http://www.caris.com");
        sl.setName("CARIS World Map");
        sl.setWFSVersion("1.0.0");
        sl.setResponseFormat("GML");
        sl.addDataLayer(new DataLayer("Buildings"));
        return sl;
    }

    /**
     * Test adding a list of layers to a theme
     */
    @Test
    public void testThemeSetLayers() {
        List<ThemeLayer> layers = this.buildThemeLayers();
        Theme theme = new Theme();
        theme.setLayers(layers);
        assertEquals(theme.getLayers().size(), 3);

    }

    /**
     * Test setting the theme background color
     */
    @Test
    public void testThemeBackgroundHexColor() {
        Theme theme = new Theme();
        theme.setBackgroundColor("0099CC");
        assertEquals(theme.getBackgroundColor(), "0099CC");
    }

    /**
     * Test setting the theme background color
     */
    @Test
    public void testThemeBackgroundColorColor() {
        Theme theme = new Theme();
        theme.setBackgroundColor(Color.DARK_GRAY);
        assertEquals(theme.getBackgroundColor(), "404040");
    }

    /**
     * Test setting the theme background color
     */
    @Test
    public void testThemeBackgroundRGBColor() {
        Theme theme = new Theme();
        theme.setBackgroundColor(255, 0, 0);
        assertEquals(theme.getBackgroundColor(), "ff0000");
    }

    /**
     * A simple equals test.
     */
    @Test
    public void testEquals() {
        Theme t1 = new Theme();
        Theme t2 = new Theme();
        assertEquals(t1, t2);
    }

    /**
     * Test the same object being compared.
     */
    @Test
    public void testEqualsSame() {
        Theme t1 = new Theme();
        assertEquals(t1, t1);
    }

    /**
     * Test a wrong type of object being compared.
     */
    @Test
    public void testEqualsWrongObject() {
        Theme t1 = new Theme();
        Object obj = new Object();
        assertFalse(t1.equals(obj));
    }

    /**
     * Test same ids.
     */
    @Test
    public void testEqualsSameID() {
        Theme t1 = new Theme();
        t1.setId(1);
        Theme t2 = new Theme();
        t2.setId(1);
        assertEquals(t1, t2);
    }

    /**
     * Test different ids.
     */
    @Test
    public void testEqualsDifferentID() {
        Theme t1 = new Theme();
        t1.setId(1);
        Theme t2 = new Theme();
        t2.setId(2);
        assertFalse(t1.equals(t2));
    }

    /**
     * Test same display order.
     */
    @Test
    public void testEqualsSameDisplayOrder() {
        Theme t1 = new Theme();
        t1.setDisplayOrder(1);
        Theme t2 = new Theme();
        t2.setDisplayOrder(1);
        assertEquals(t1, t2);
    }

    /**
     * Test different display order.
     */
    @Test
    public void testEqualsDifferentDisplayOrder() {
        Theme t1 = new Theme();
        t1.setDisplayOrder(1);
        Theme t2 = new Theme();
        t2.setDisplayOrder(2);
        assertFalse(t1.equals(t2));
    }

    /**
     * Test same name.
     */
    @Test
    public void testEqualsSameName() {
        Theme t1 = new Theme();
        t1.setName("Papa Smurf");
        Theme t2 = new Theme();
        t2.setName("Papa Smurf");
        assertEquals(t1, t2);
    }

    /**
     * Test different name return false.
     */
    @Test
    public void testEqualsDifferentName() {
        Theme t1 = new Theme();
        t1.setName("Smurfette");
        Theme t2 = new Theme();
        t2.setName("Brainy Smurf");
        assertFalse(t1.equals(t2));
    }

    /**
     * Test one null name return false.
     */
    @Test
    public void testEqualsOneNullName() {
        Theme t1 = new Theme();
        t1.setName("Lazy Smurf");
        Theme t2 = new Theme();
        t2.setName(null);
        assertFalse(t1.equals(t2));
    }

    /**
     * Test both null names return true.
     */
    @Test
    public void testEqualsBothNullName() {
        Theme t1 = new Theme();
        t1.setName(null);
        Theme t2 = new Theme();
        t2.setName(null);
        assertEquals(t1, t2);
    }

    /**
     * Test same srs.
     */
    @Test
    public void testEqualsSameSRS() {
        Theme t1 = new Theme();
        t1.setSRS("Papa Smurf");
        Theme t2 = new Theme();
        t2.setSRS("Papa Smurf");
        assertEquals(t1, t2);
    }

    /**
     * Test different srs return false.
     */
    @Test
    public void testEqualsDifferentSRS() {
        Theme t1 = new Theme();
        t1.setSRS("Smurfette");
        Theme t2 = new Theme();
        t2.setSRS("Brainy Smurf");
        assertFalse(t1.equals(t2));
    }

    /**
     * Test one null srs return false.
     */
    @Test
    public void testEqualsOneNullSRS() {
        Theme t1 = new Theme();
        t1.setSRS("Lazy Smurf");
        Theme t2 = new Theme();
        t2.setSRS(null);
        assertFalse(t1.equals(t2));
    }

    /**
     * Test both null srs return true.
     */
    @Test
    public void testEqualsBothNullSRS() {
        Theme t1 = new Theme();
        t1.setSRS(null);
        Theme t2 = new Theme();
        t2.setSRS(null);
        assertEquals(t1, t2);
    }

    /**
     * Test same background colour.
     */
    @Test
    public void testEqualsSameBackgroundColour() {
        Theme t1 = new Theme();
        t1.setBackgroundColor("Papa Smurf");
        Theme t2 = new Theme();
        t2.setBackgroundColor("Papa Smurf");
        assertEquals(t1, t2);
    }

    /**
     * Test different background colour return false.
     */
    @Test
    public void testEqualsDifferentBackgroundColour() {
        Theme t1 = new Theme();
        t1.setBackgroundColor("Smurfette");
        Theme t2 = new Theme();
        t2.setBackgroundColor("Brainy Smurf");
        assertFalse(t1.equals(t2));
    }

    /**
     * Test one null background colour return false.
     */
    @Test
    public void testEqualsOneNullBackgroundColour() {
        Theme t1 = new Theme();
        t1.setBackgroundColor("Lazy Smurf");
        Theme t2 = new Theme();
        assertFalse(t1.equals(t2));
    }

    /**
     * Test same parameters.
     */
    @Test
    public void testEqualsSameParameters() {
        Theme t1 = new Theme();
        t1.addParameter("smurf", new String("Hefty Smurf"));
        Theme t2 = new Theme();
        t2.addParameter("smurf", new String("Hefty Smurf"));
        assertEquals(t1, t2);
    }

    /**
     * Test different parameters return false.
     */
    @Test
    public void testEqualsDifferentParametersValues() {
        Theme t1 = new Theme();
        t1.addParameter("smurf", new String("Hefty Smurf"));
        Theme t2 = new Theme();
        t2.addParameter("smurf", new String("Jokey Smurf"));
        assertFalse(t1.equals(t2));
    }

    /**
     * Test different parameters return false.
     */
    @Test
    public void testEqualsDifferentParametersKeys() {
        Theme t1 = new Theme();
        t1.addParameter("smurf", new String("Hefty Smurf"));
        Theme t2 = new Theme();
        t2.addParameter("jokey smurf", new String("Hefty Smurf"));
        assertFalse(t1.equals(t2));
    }

    /**
     * Test one null parameter return false.
     */
    @Test
    public void testEqualsOneEmptyParameters() {
        Theme t1 = new Theme();
        t1.addParameter("smurf", new String("Hefty Smurf"));
        Theme t2 = new Theme();
        assertFalse(t1.equals(t2));
    }

    /**
     * Test same covers.
     */
    @Test
    public void testEqualsSameCovers() {
        Set<Cover> covers = new HashSet<Cover>();
        covers.add(new Cover());

        Theme t1 = new Theme();
        t1.setCovers(covers);

        Theme t2 = new Theme();
        t2.setCovers(covers);

        assertEquals(t1, t2);
    }

    /**
     * Test different covers return false.
     */
    @Test
    public void testEqualsDifferentCovers() {
        Theme t1 = new Theme();
        Set<Cover> covers1 = new HashSet<Cover>();
        covers1.add(new Cover());
        t1.setCovers(covers1);

        Theme t2 = new Theme();
        Set<Cover> covers2 = new HashSet<Cover>();
        covers2.add(new Cover());
        t2.setCovers(covers2);

        assertFalse(t1.equals(t2));
    }

    /**
     * Test one null covers return false.
     */
    @Test
    public void testEqualsOneNullCovers() {
        Set<Cover> covers = new HashSet<Cover>();
        covers.add(new Cover());
        Theme t1 = new Theme();
        t1.setCovers(covers);

        Theme t2 = new Theme();
        t2.setCovers(null);
        assertFalse(t1.equals(t2));
    }

    /**
     * Test both null covers return true.
     */
    @Test
    public void testEqualsBothNullCovers() {
        Theme t1 = new Theme();
        t1.setCovers(null);
        Theme t2 = new Theme();
        t2.setCovers(null);
        assertEquals(t1, t2);
    }

    /**
     * Test same layers.
     */
    @Test
    public void testEqualsSameLayers() {
        List<ThemeLayer> tl = this.buildThemeLayers();
        Theme t1 = new Theme();
        t1.setLayers(tl);

        Theme t2 = new Theme();
        t2.setLayers(tl);

        assertEquals(t1, t2);
    }

    /**
     * Test different layers return false.
     */
    @Test
    public void testEqualsDifferentLayers() {
        Theme t1 = new Theme();
        t1.setLayers(this.buildThemeLayers());

        Theme t2 = new Theme();
        t2.setLayers(this.buildThemeLayers());

        assertFalse(t1.equals(t2));
    }

    /**
     * Test one null layers return false.
     */
    @Test
    public void testEqualsOneNotInitializedLayers() {
        Theme t1 = new Theme();
        t1.setLayers(this.buildThemeLayers());

        Theme t2 = new Theme();
        assertFalse(t1.equals(t2));
    }

    /**
     * @return List<ThemeLayer> Return a list of theme layers for testing.
     */
    private List<ThemeLayer> buildThemeLayers() {
        ArrayList<ThemeLayer> layers = new ArrayList<ThemeLayer>();
        layers.add(createThemeLayer());
        layers.add(createMarkerLayer());
        layers.add(createSelectionLayer());

        return layers;
    }
}
