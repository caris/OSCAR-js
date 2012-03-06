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

import com.caris.oscarexchange4j.theme.exceptions.ValidationException;

/*
 * WEB-999 - Class added to abstract overlay layers from theme layers.
 * WEB-1005 - Added validation rules for Overlays.
 */

/**
 * This class represents overlay layers such as Markers and WFS layers.
 * 
 * @author tcoburn
 * 
 */
public abstract class Overlay extends ThemeLayer {
    /**
     * Sets the baseLayer and displayOrder attributes;
     */
    protected Overlay() {
        super.isBaseLayer(false);
        super.setDisplayOrder(-1);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.ThemeLayer#setDisplayOrder(int)
     */
    /**
     * Method override to remove ability to change the display order of
     * Overlays.
     **/
    @Override
    public void setDisplayOrder(int displayOrder) {

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.ThemeLayer#isBaseLayer(boolean)
     */
    /**
     * Method override to remove ability to change the base layer member of
     * Overlays.
     */
    @Override
    public void isBaseLayer(boolean baseLayer) {

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.ThemeLayer#setBaseLayer(boolean)
     */
    /**
     * @deprecated Method override to remove ability to change the base layer
     *             member of Overlays.
     */
    @Override
    public void setBaseLayer(boolean baseLayer) {
        this.isBaseLayer(baseLayer);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.ThemeLayer#validate()
     */
    /**
     * Validation Rules for Overlays: - baseLayer is false - displayOrder is -1
     */
    @Override
    public boolean validate() throws ValidationException {
        super.validate();
        if (this.isBaseLayer()) {
            throw new ValidationException(
                    "Overlays cannot be a base layer, use isBaseLayer(false).");
        }
        if (this.getDisplayOrder() != -1) {
            throw new ValidationException(
                    "Overlays must have a displayOrder of -1.");
        }
        return true;
    }
}