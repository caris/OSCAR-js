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
 * WEB-995 Added tests for feature colors.
 */
import java.awt.Color;

import com.caris.oscarexchange4j.theme.exceptions.ValidationException;

import junit.framework.TestCase;

/**
 * @author tcoburn
 * 
 */
public class TestSelectionLayer extends TestCase {

    /**
     * 
     */
    public void testSelectionLayerInheritance() {
        SelectionLayer sl = new SelectionLayer();
        assertTrue(sl instanceof Overlay);
    }

    /**
     * Test to verity LayerType cannot be changed.
     */
    public void testSelectionLayerNoChangeLayerType() {
        SelectionLayer sl = createSelectionLayer();
        assertTrue(sl.getLayerType() == LayerType.SELECTION);
        sl.setLayerType(LayerType.MARKER);
        assertTrue(sl.getLayerType() == LayerType.SELECTION);
    }

    /**
     * Test to verify the display order cannot be changed.
     */
    public void testSelectionLayerDisplayOrder() {
        SelectionLayer sl = createSelectionLayer();
        assertTrue(sl.getDisplayOrder() == -1);
        sl.setDisplayOrder(2);
        assertTrue(sl.getDisplayOrder() == -1);
    }

    /**
     * Test to verify the base layer member cannot be changed.
     */
    public void testSelectionLayerNonBaseLayer() {
        SelectionLayer sl = createSelectionLayer();
        assertTrue(!sl.isBaseLayer());
        sl.isBaseLayer(true);
        assertTrue(!sl.isBaseLayer());

    }

    /**
     * Test to see if exception is thrown when the wfsVersion member is null.
     */
    public void testSelectionLayerIsInvalid_WFSVersionIsNull() {
        SelectionLayer sl = new SelectionLayer();
        try {
            sl.validate();
        } catch (ValidationException e) {
            assertNull(sl.getWFSVersion());
            assertTrue("Validation Exception thrown",
                    e instanceof ValidationException);
        }
    }

    /**
     * Test to see if exception is thrown when the wfsVersion member is 0
     * length.
     */
    public void testSelectionLayerIsInvalid_WFSVersionIsZeroLength() {
        SelectionLayer sl = new SelectionLayer();
        sl.setWFSVersion("");
        try {
            sl.validate();
        } catch (ValidationException e) {
            assertEquals(sl.getWFSVersion().length(), 0);
            assertTrue("Validation Exception thrown",
                    e instanceof ValidationException);
        }
    }

    /**
     * Test to see if exception is thrown when the responseFormat member is
     * null.
     */
    public void testSelectionLayerIsInValid_ResponseFormatIsNull() {
        SelectionLayer sl = new SelectionLayer();
        sl.setWFSVersion("1.0.0");
        try {
            sl.validate();
        } catch (ValidationException e) {
            assertNull(sl.getResponseFormat());
            assertTrue("Validation Exception thrown",
                    e instanceof ValidationException);
        }
    }

    /**
     * Test to see if exception is thrown when the responseFormat member is 0
     * length.
     */
    public void testSelectionLayerIsInValid_ResponseFormatIsZeroLength() {
        SelectionLayer sl = new SelectionLayer();
        sl.setWFSVersion("1.0.0");
        sl.setResponseFormat("");
        try {
            sl.validate();
        } catch (ValidationException e) {
            assertEquals(sl.getResponseFormat().length(), 0);
            assertTrue("Validation Exception thrown",
                    e instanceof ValidationException);
        }
    }
    
    /**
     * Test to see if the default featureColor and featureSelectedColor are set.
     */
    public void testSelectionDefaultColors() {
        SelectionLayer sl = new SelectionLayer();
        String featureColor = sl.getFeatureColor();
        System.out.println(featureColor);
        assertEquals(featureColor,"ee9900");
        String featureSelectedColor = sl.getFeatureSelectedColor();
        assertEquals(featureSelectedColor,"0000ff");
    }
    
    public void testSetFeatureColor() {
        SelectionLayer sl = new SelectionLayer();
        sl.setFeatureColor(Color.BLACK);
        assertEquals(sl.getFeatureColor(),"000000");
    }
    
    /**
     * Private method to quickly create a selection layer and populate some
     * field members.
     * 
     * @return
     */
    private SelectionLayer createSelectionLayer() {
        SelectionLayer sl = new SelectionLayer();
        sl.setName("Fredericton Forests");
        sl.addDataLayer(createDataLayer("Forests"));
        return sl;
    }

    /**
     * Private method to quickly create a data layer.
     * 
     * @param layerName
     * @return
     */
    private DataLayer createDataLayer(String layerName) {
        DataLayer dl = new DataLayer();
        dl.setLayerName(layerName);
        return dl;
    }
}
