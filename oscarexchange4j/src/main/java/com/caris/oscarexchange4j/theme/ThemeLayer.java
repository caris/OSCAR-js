/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2016 CARIS <http://www.caris.com>
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import com.caris.oscarexchange4j.theme.exceptions.ValidationException;
import com.caris.oscarexchange4j.theme.interfaces.Validatable;

/**
 * This class represents an Oscar ThemeLayer
 * 
 * @author tcoburn
 * 
 */
public class ThemeLayer implements Validatable, Comparable<ThemeLayer> {
    /* Parameter definitions */
    public static final String PARAM_BUFFER = "buffer";

    public static final String PARAM_ZOOMLVLS = "numzoomlevels";

    public static final String PARAM_SINGLETILE = "false";

    public static final String PARAM_TRANSITION = "resize";

    /**
     * Private member for the id of the layer.
     */
    private int layerId;

    /**
     * Private member for the name of the layer.
     */
    private String name;

    /**
     * Private member for the urls available for the layer.
     */
    private List<String> urls = new ArrayList<String>();

    /**
     * Private member for the layer format. Defaults to image/png
     */
    private String format = "image/png";

    /**
     * Private memeber for baseLayer.
     */
    private boolean baseLayer;

    /**
     * com.caris.oscarexchange4j.theme.LayerType for the layer. Defaults to
     * LayerType.WMS
     */
    private LayerType layerType = LayerType.WMS;

    /**
     * Private member containing the associated data layers.
     */
    private List<DataLayer> dataLayers;

    /**
     * Private member for the display order of the layer.
     */
    private int displayOrder;

    /**
     * Private member containing additional parameters for the layer.
     * 
     * @return Map<String,String>
     */
    private Map<String, String> parameters;
    {
        this.parameters = new HashMap<String, String>();
        this.parameters.put(ThemeLayer.PARAM_BUFFER, "0");
    }

    /**
     * Get the theme layer identifier.
     * 
     * @return The theme layer identifier.
     */
    public int getLayerId() {
        return layerId;
    }

    /**
     * Set the theme layer identifier.
     * 
     * @param layerId
     *            The theme layer identifier.
     */
    public void setLayerId(int layerId) {
        this.layerId = layerId;
    }

    /**
     * Get the theme layer name.
     * 
     * @return The theme layer name.
     */
    public String getName() {
        return name;
    }

    /**
     * Set the theme layer name.
     * 
     * @param name
     *            The theme layer name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the theme layer URL.
     * 
     * @deprecated replaced with getUrl(index)
     * @return The theme layer URL.
     */
    public String getUrl() {
        return this.urls.get(0);
    }

    /**
     * Get the theme layer URL for the given index.
     * 
     * @param index
     *            The index of the desired URL.
     * @return The theme layer URL.
     */
    public String getUrl(int index) {
        if (index >= this.urls.size())
            return "";
        else
            return this.urls.get(index);
    }

    /**
     * Get the theme layer format.
     * 
     * @return The theme layer format.
     */
    public String getFormat() {
        return format;
    }

    /**
     * Set the theme layer format.
     * 
     * @param format
     *            The theme layer format.
     */
    public void setFormat(String format) {
        this.format = format;
    }

    /**
     * Is this theme layer a base layer?
     * 
     * @return True if the theme layer is a base layer.
     */
    public boolean isBaseLayer() {
        return baseLayer;
    }

    /**
     * Indicate if this is a base layer.
     * 
     * @param baseLayer
     *            True if this theme layer is to be base layer, otherwise false.
     **/
    public void isBaseLayer(boolean baseLayer) {
        this.baseLayer = baseLayer;
    }

    /**
     * Indicate if this is a base layer.
     * 
     * @deprecated replaced with isBaseLayer(boolean)
     * @param baseLayer
     *            True if this theme layer is to be a base layer, otherwise
     *            false.
     */
    public void setBaseLayer(boolean baseLayer) {
        this.baseLayer = baseLayer;
    }

    /**
     * Get the list of data layers.
     * 
     * @return A list of data layers.
     */
    public List<DataLayer> getDataLayers() {
        return dataLayers;
    }

    /**
     * Set the data layers to this theme layer.
     * 
     * @param dataLayers
     *            The list of data layers to be set on this theme layer.
     */
    public void setDataLayers(List<DataLayer> dataLayers) {
        this.dataLayers = dataLayers;
    }

    /**
     * Set a data layer to this theme layer.
     * 
     * @param dataLayer
     *            The data layer to set to this theme layer.
     * @return boolean True if the addition of a data layer was successful,
     *         otherwise false.
     */
    public boolean addDataLayer(DataLayer dataLayer) {
        if (this.dataLayers == null) {
            this.dataLayers = new ArrayList<DataLayer>();
        }
        return this.dataLayers.add(dataLayer);
    }

    /**
     * Set the parameters associated to this layer.
     * 
     * @param parameters
     *            The parameters associated to this layer.
     */
    public void setParameters(Map<String, String> parameters) {
        this.parameters = parameters;
    }

    /**
     * This method returns the map of parametrers associated with the layer.
     * 
     * @return The parameters.
     */
    public Map<String, String> getParameters() {
        return parameters;
    }

    /**
     * This method will add parameters associated with the layer.
     * 
     * @param key
     *            The key.
     * @param value
     *            The value.
     */
    public void addParameter(String key, String value) {
        this.parameters.put(key, value);
    }

    /**
     * This method sets the com.caris.oscarexchange4j.theme.LayerType of the
     * layer.
     * 
     * @param layerType
     *            The layerType to set
     */
    public void setLayerType(LayerType layerType) {
        this.layerType = layerType;
    }

    /**
     * This method returns the com.caris.oscarexchange4j.theme.LayerType of the
     * layer.
     * 
     * @return The type of layer this is.
     */
    public LayerType getLayerType() {
        return layerType;
    }

    /**
     * This method sets the display order of the layer.
     * 
     * @param displayOrder
     *            The displayOrder to set.
     */
    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    /**
     * This method returns the display order of the layer.
     * 
     * @return A number representing the display order of the theme layer.
     */
    public int getDisplayOrder() {
        return displayOrder;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Comparable#compareTo(java.lang.Object)
     */
    public int compareTo(ThemeLayer o) {
        if (this.getDisplayOrder() < o.getDisplayOrder()) {
            return -1;
        } else if (this.getDisplayOrder() > o.getDisplayOrder()) {
            return 1;
        }
        return 0;
    }

    /**
     * This method sets the list of urls associated with the layer.
     * 
     * @param urls
     *            the urls to set
     */
    public void setUrls(List<String> urls) {
        this.urls = urls;
    }

    /**
     * This method returns the urls associated with the layer.
     * 
     * @return A list of Strings, assumed to be URLs.
     */
    public List<String> getUrls() {
        return urls;
    }

    /**
     * Used to add a url to the source list. Will append transparent=true
     * paraemter if it is not present.
     * 
     * @param url
     *            The URL to add to this theme layer.
     * @return True if successful, false if not.
     */
    public boolean addUrl(String url) {
        return this.urls.add(url);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.interfaces.Validatable#validate()
     */
    /**
     * Validation Rules for ThemeLayer: - contains at least 1 source url - name
     * member is set - layerType is valid
     **/
    @Override
    public boolean validate() throws ValidationException {
        if (this.urls == null)
            throw new ValidationException(
                    "Layer must contain at least 1 source url.");
        else if (this.urls.size() == 0)
            throw new ValidationException(
                    "Layer must contain at least 1 source url.");
        else if (this.name == null)
            throw new ValidationException("Layer must have a name.");
        else if (this.name.length() == 0)
            throw new ValidationException("Layer name is empty");
        else if (this.layerType == null)
            throw new ValidationException("Layer must have a LayerType.");

        return true;
    }

}
