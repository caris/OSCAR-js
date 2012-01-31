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
 * WEB-1002 - JavaDocs cleanup.
 * WEB-1031 - Removed tests for transparent parameter appended to the url when adding.
 */
import junit.framework.TestCase;

/**
 * @author tcoburn
 * 
 */
public class TestThemeLayer extends TestCase {
    private ThemeLayer themeLayer;

    /*
     * (non-Javadoc)
     * 
     * @see junit.framework.TestCase#setUp()
     */
    @Override
    protected void setUp() throws Exception {
        super.setUp();
        themeLayer = new ThemeLayer();
    }

    /*
     * (non-Javadoc)
     * 
     * @see junit.framework.TestCase#tearDown()
     */
    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
        themeLayer = null;
    }

    /**
     * Test to check override when adding a parameter.
     */
    public void testNewParameter() {
        String oldKeyValue = this.themeLayer.getParameters().get(
                ThemeLayer.PARAM_BUFFER);
        this.themeLayer.addParameter(ThemeLayer.PARAM_BUFFER, "2");
        String newKeyValue = this.themeLayer.getParameters().get(
                ThemeLayer.PARAM_BUFFER);
        assertFalse(oldKeyValue.equals(newKeyValue));
    }
    
    /**
     * Test the default value for getFormat is image/png
     */
    public void testDefaultFormat() {
        ThemeLayer tl = new ThemeLayer();
        assertTrue(tl.getFormat().equals("image/png"));
    }

}
