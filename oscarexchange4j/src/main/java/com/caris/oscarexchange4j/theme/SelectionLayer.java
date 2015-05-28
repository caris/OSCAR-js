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

import java.awt.Color;

import com.caris.oscarexchange4j.theme.exceptions.ValidationException;
import com.caris.oscarexchange4j.theme.interfaces.WebFeatureService;
import com.caris.oscarexchange4j.util.OXUtil;

/**
 * The SelectionLayer is a layer that takes a WFS connection. This layer is not
 * shown by default, but contains data required to perform on-demand selections
 * against WFS services.
 * 
 * @author tcoburn
 * 
 */
public class SelectionLayer extends Overlay implements WebFeatureService {

    private String wfsVersion;

    private String responseFormat;

    private String featureColor;

    private String featureSelectedColor;

    public SelectionLayer() {
        super.setLayerType(LayerType.SELECTION);
        this.setFeatureColor(new Color(238, 153, 0));
        this.setFeatureSelectedColor(new Color(0, 0, 255));
    }

    /*
     * (non-Javadoc)
     * 
     * @seecom.caris.oscarexchange4j.theme.ThemeLayer#setLayerType(com.caris.
     * oscarexchange4j.theme.LayerType)
     */
    /**
     * Method override to remove ability to change layer type.
     */
    @Override
    public void setLayerType(LayerType layerType) {
    }

    /*
     * (non-Javadoc)
     * 
     * @seecom.caris.oscarexchange4j.theme.interfaces.WebFeatureService#
     * getResponseFormat()
     */
    @Override
    public String getResponseFormat() {
        return this.responseFormat;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.caris.oscarexchange4j.theme.interfaces.WebFeatureService#getWFSVersion
     * ()
     */
    @Override
    public String getWFSVersion() {
        return this.wfsVersion;
    }

    /*
     * (non-Javadoc)
     * 
     * @seecom.caris.oscarexchange4j.theme.interfaces.WebFeatureService#
     * setResponseFormat(java.lang.String)
     */
    @Override
    public void setResponseFormat(String responseFormat) {
        this.responseFormat = responseFormat;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.caris.oscarexchange4j.theme.interfaces.WebFeatureService#setWFSVersion
     * (java.lang.String)
     */
    @Override
    public void setWFSVersion(String wfsVersion) {
        this.wfsVersion = wfsVersion;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.Overlay#validate()
     */
    /**
     * Validation Rules for SelectionLayer: - wfsVersion is set. -
     * responseFormat is set. - Has at least one data layer
     * 
     */
    @Override
    public boolean validate() throws ValidationException {
        super.validate();

        if (this.getWFSVersion() == null || this.getWFSVersion().length() == 0) {
            throw new ValidationException("wfsVersion is null or has 0 length");
        } else if (this.getResponseFormat() == null
                || this.getResponseFormat().length() == 0) {
            throw new ValidationException(
                    "responseFormat is null or has 0 length");
        } else if (this.getDataLayers() == null) {
            throw new ValidationException(
                    "Must have at least one data layer present.");

        } else if (this.getDataLayers().size() == 0) {
            throw new ValidationException(
                    "Must have at least one data layer present.");
        }
        return true;
    }

    /**
     * Set the feature colour.
     * 
     * @param featureColor
     *            The featureColor to set.
     */
    public void setFeatureColor(String featureColor) {
        this.featureColor = featureColor;
    }

    /**
     * Set the feature colour using 0-255 values for R, G, and B.
     * 
     * @param red
     *            The red value (0-255)
     * @param green
     *            The green value (0-255).
     * @param blue
     *            The blue value (0-255).
     */
    public void setFeatureColor(int red, int green, int blue) {
        this.setFeatureColor(OXUtil.RGBToHex(red, green, blue));
    }

    /**
     * Set the feature colour.
     * 
     * @param color
     *            The colour to set on the feature.
     */
    public void setFeatureColor(Color color) {
        this.setFeatureColor(OXUtil.ColorToHex(color));
    }

    /**
     * Get the feature colour as HEX.
     * 
     * @return A HEX colour string.
     */
    public String getFeatureColor() {
        return featureColor;
    }

    /**
     * Set the feature selected colour.
     * 
     * @param featureSelectedColor
     *            The featureSelectedColor to set.
     */
    public void setFeatureSelectedColor(String featureSelectedColor) {
        this.featureSelectedColor = featureSelectedColor;
    }

    /**
     * Set the feature selected colour.
     * 
     * @param red
     *            The red value (0-255)
     * @param green
     *            The green value (0-255).
     * @param blue
     *            The blue value (0-255).
     */
    public void setFeatureSelectedColor(int red, int green, int blue) {
        this.setFeatureSelectedColor(OXUtil.RGBToHex(red, green, blue));
    }

    /**
     * Set the feature selected colour.
     * 
     * @param color
     *            The selected feature colour to set.
     */
    public void setFeatureSelectedColor(Color color) {
        this.setFeatureSelectedColor(OXUtil.ColorToHex(color));
    }

    /**
     * Get the feature selected colour as HEX.
     * 
     * @return A HEX colour string.
     */
    public String getFeatureSelectedColor() {
        return featureSelectedColor;
    }

}
