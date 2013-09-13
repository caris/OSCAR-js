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

import static org.junit.Assert.*;

import java.awt.Color;

import org.junit.Test;

import com.caris.oscarexchange4j.theme.CoverType;
import com.caris.oscarexchange4j.util.OXUtil;

public class TestOXUtil {
    @Test
    public void testCreateCoverTypeFromValidString() {
        CoverType type = OXUtil.createCoverType("DEFAULT");
        assertTrue(type.toString().equals("DEFAULT"));
    }

    @Test
    public void testCreateCoverTypeFromInValidString() {
        CoverType type = OXUtil.createCoverType("TEST");
        assertTrue(type.toString().equals("DEFAULT"));
    }

    /**
     * Test converting a Color object to a hex string color.
     */
    @Test
    public void testColorToHex() {
        Color color = new Color(255, 0, 0);
        String hexColor = OXUtil.ColorToHex(color);
        assertEquals(hexColor, "ff0000");
    }

    /**
     * Test converting red, green, blue values to a hex string color;
     */
    @Test
    public void testRGBToHex() {
        String hexColor = OXUtil.RGBToHex(0, 0, 255);
        assertEquals(hexColor, "0000ff");
    }

    @Test
    public void testLenghtOfHex() {
        String hexColor = OXUtil.RGBToHex(0, 0, 0);
        assertEquals(hexColor.length(), 6);
        hexColor = OXUtil.ColorToHex(Color.BLACK);
        assertEquals(hexColor.length(), 6);
    }

    /**
     * Tests the result values for the GoogleCRS84 scale
     */
    @Test
    public void getScaleSetForGoogleQuad() {
        ScaleSet scaleSet = OXUtil.getScaleSet("EPSG:4326");

        assertTrue(scaleSet.getTileMatrixSet().equals(ScaleSet.GoogleCRS84Quad));

        double[] tileOrigin = scaleSet.getTileOrigin();
        assertTrue(tileOrigin[0] == -180.00);
        assertTrue(tileOrigin[1] == 180.00);

        double[] fullExtent = scaleSet.getTileFullExtent();
        assertTrue(fullExtent[0] == -180.00);
        assertTrue(fullExtent[1] == -180.00);
        assertTrue(fullExtent[2] == 180.00);
        assertTrue(fullExtent[3] == 180.00);
    }
}
