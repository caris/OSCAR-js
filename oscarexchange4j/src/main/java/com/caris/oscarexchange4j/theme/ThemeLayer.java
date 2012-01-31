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
 * WEB-1005 - Implemented Validatable interface and defined validation rules.
 * WEB-1031 - Removed the transparent parameter from being added to the url.
 */
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
     * Private member for the layer format.
     * Defaults to image/png
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
     * @return int
     */
    public int getLayerId() {
        return layerId;
    }

    /**
     * @param layerId
     */
    public void setLayerId(int layerId) {
        this.layerId = layerId;
    }

    /**
     * @return java.lang.String
     */
    public String getName() {
        return name;
    }

    /**
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @deprecated replaced with getUrl(index)
     * @return java.lang.String url
     */
    public String getUrl() {
        return this.urls.get(0);
    }

    /**
     * @param index
     * @return java.lang.String url
     */
    public String getUrl(int index) {
        if (index >= this.urls.size())
            return "";
        else
            return this.urls.get(index);
    }

    /**
     * @return java.lang.String format
     */
    public String getFormat() {
        return format;
    }

    /**
     * @param format
     */
    public void setFormat(String format) {
        this.format = format;
    }

    /**
     * @return boolean
     */
    public boolean isBaseLayer() {
        return baseLayer;
    }

    /**
     * @param baseLayer
     **/
    public void isBaseLayer(boolean baseLayer) {
        this.baseLayer = baseLayer;
    }

    /**
     * @deprecated replaced with isBaseLayer(boolean)
     * @param baseLayer
     */
    public void setBaseLayer(boolean baseLayer) {
        this.baseLayer = baseLayer;
    }

    /**
     * @return List<DataLayer>
     */
    public List<DataLayer> getDataLayers() {
        return dataLayers;
    }

    /**
     * @param dataLayers
     */
    public void setDataLayers(List<DataLayer> dataLayers) {
        this.dataLayers = dataLayers;
    }

    /**
     * @param dataLayer
     * @return boolean
     */
    public boolean addDataLayer(DataLayer dataLayer) {
        if (this.dataLayers == null) {
            this.dataLayers = new ArrayList<DataLayer>();
        }
        return this.dataLayers.add(dataLayer);
    }

    /**
     * @param parameters
     */
    public void setParameters(Map<String, String> parameters) {
        this.parameters = parameters;
    }

    /**
     * This method returns the map of parametrers associated with the layer.
     * 
     * @return Map<String,String>
     */
    public Map<String, String> getParameters() {
        return parameters;
    }

    /**
     * This method will add parameters associated with the layer.
     * 
     * @param key
     * @param value
     */
    public void addParameter(String key, String value) {
        this.parameters.put(key, value);
    }

    /**
     * This method sets the com.caris.oscarexchange4j.theme.LayerType of the
     * layer.
     * 
     * @param layerType
     *            the layerType to set
     */
    public void setLayerType(LayerType layerType) {
        this.layerType = layerType;
    }

    /**
     * This method returns the com.caris.oscarexchange4j.theme.LayerType of the
     * layer.
     * 
     * @return LayerType
     */
    public LayerType getLayerType() {
        return layerType;
    }

    /**
     * This method sets the display order of the layer.
     * 
     * @param displayOrder
     *            the displayOrder to set
     */
    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    /**
     * This method returns the display order of the layer.
     * 
     * @return int
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
     * @return java.util.List<String>
     */
    public List<String> getUrls() {
        return urls;
    }

    /**
     * Used to add a url to the source list. Will append transparent=true
     * paraemter if it is not present.
     * 
     * @param url
     * @return true if successful, false if not.
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
