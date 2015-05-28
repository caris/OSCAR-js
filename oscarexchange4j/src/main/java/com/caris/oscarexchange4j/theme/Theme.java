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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.caris.oscarexchange4j.theme.exceptions.ValidationException;
import com.caris.oscarexchange4j.theme.services.Services;
import com.caris.oscarexchange4j.util.OXUtil;

/**
 * This class represents an Oscar Theme
 * 
 * @author tcoburn
 * 
 */
public class Theme {

    /**
     * The theme version.
     */
    final double version = 1.0;

    /**
     * Number of zoom levels allowed.
     */
    public static final String PARAM_ZOOMLEVELS = "numzoomlevels";

    /**
     * The id.
     */
    int id;

    /**
     * Theme parameters.
     */
    private Map<String, String> parameters = new HashMap<String, String>();

    /**
     * Theme name.
     */
    String name;

    /**
     * Theme covers.
     */
    Set<Cover> covers;

    /**
     * The position object.
     */
    private Position position;

    /**
     * The layers that a theme contains.
     */
    List<ThemeLayer> layers;

    /**
     * Path pointing to legend graphic.
     */
    private String legend;

    Services services;

    /**
     * Represents the position it should take when dealing with a group of
     * themes.
     */
    int displayOrder;

    /**
     * Coordinate system.
     */
    String srs;

    /**
     * Background colour.
     */
    String backgroundColor;

    /**
     * selection style options
     */
    SelectionStyle selectionStyle;

    /**
     * Get the background colour.
     * 
     * @return String The background color
     */
    public String getBackgroundColor() {
        return this.backgroundColor;
    }

    /**
     * Set the background colour.
     * 
     * @param backgroundColor
     *            the backgroundColor to set
     */
    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    /**
     * Set the background colour.
     * 
     * @param red
     *            The red value (0-255)
     * @param green
     *            The green value (0-255).
     * @param blue
     *            The blue value (0-255).
     */
    public void setBackgroundColor(int red, int green, int blue) {
        this.setBackgroundColor(OXUtil.RGBToHex(red, green, blue));
    }

    /**
     * Set the background colour.
     * 
     * @param color
     *            The background colour.
     */
    public void setBackgroundColor(Color color) {
        this.setBackgroundColor(OXUtil.ColorToHex(color));
    }

    /**
     * Set the selection style.
     * 
     * @param selectionStyle
     *            The selection style for this theme.
     */
    public void setSelectionStyle(SelectionStyle selectionStyle) {
        this.selectionStyle = selectionStyle;
    }

    /**
     * Get the selection style.
     * 
     * @return The selection style for this theme.
     */
    public SelectionStyle getSelectionStyle() {
        return selectionStyle;
    }

    /**
     * Get the display order.
     * 
     * @return The position of where it should be displayed.
     */
    public int getDisplayOrder() {
        return displayOrder;
    }

    /**
     * Set the display order.
     * 
     * @param displayOrder
     *            The position of where it should be displayed.
     */
    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    /**
     * Get the list of layers for this theme.
     * 
     * @return The list of layers associated to the theme.
     */
    public List<ThemeLayer> getLayers() {
        return layers;
    }

    /**
     * Set the list of layers for this theme.
     * 
     * @param layers
     *            Set the layers to the theme.
     */
    public void setLayers(List<ThemeLayer> layers) {
        for (ThemeLayer layer : layers)
            this.addLayer(layer);
    }

    /**
     * Add a layer to this theme.
     * 
     * @param layer
     *            Add a single layer to the current theme.
     */
    public void addLayer(ThemeLayer layer) {
        if (this.layers == null)
            this.layers = new ArrayList<ThemeLayer>();
        try {
            if (layer.validate())
                this.layers.add(layer);
        } catch (ValidationException e) {
            e.printStackTrace();
        }
    }

    /**
     * Get the services used by this theme.
     * 
     * @return The services in this theme.
     */
    public Services getServices() {
        return services;
    }

    /**
     * Set the services for this theme.
     * 
     * @param services
     *            The services to be used by the theme.
     */
    public void setServices(Services services) {
        this.services = services;
    }

    /**
     * Get the theme identifier.
     * 
     * @return The theme identifier.
     */
    public int getId() {
        return this.id;
    }

    /**
     * Get the covers for this theme.
     * 
     * @return A set of covers for the theme.
     */
    public Set<Cover> getCovers() {
        return this.covers;
    }

    /**
     * Get the theme name.
     * 
     * @return The theme name.
     */
    public String getName() {
        return this.name;
    }

    /**
     * Set the theme id.
     * 
     * @param id
     *            The theme id.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Set the theme name.
     * 
     * @param name
     *            The theme name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Set the theme covers.
     * 
     * @param covers
     *            A set of theme covers.
     */
    public void setCovers(Set<Cover> covers) {
        this.covers = covers;
    }

    /**
     * Get the theme version.
     * 
     * @return The theme version.
     */
    public double getVersion() {
        return this.version;
    }

    /**
     * Get the theme parameters.
     * 
     * @return The theme parameters.
     */
    public Map<String, String> getParameters() {
        return parameters;
    }

    /**
     * Set the theme parameters.
     * 
     * @param parameters
     *            The theme parameters.
     */
    public void setParameters(Map<String, String> parameters) {
        this.parameters = parameters;
    }

    /**
     * Add a value to the theme's parameter table.
     * 
     * @param key
     *            The key for the value that is used for lookup.
     * @param value
     *            The value to store associated to the key.
     */
    public void addParameter(String key, String value) {
        this.parameters.put(key, value);
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result
                + ((backgroundColor == null) ? 0 : backgroundColor.hashCode());
        result = prime * result + ((covers == null) ? 0 : covers.hashCode());
        result = prime * result + displayOrder;
        result = prime * result + id;
        result = prime * result + ((layers == null) ? 0 : layers.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result
                + ((parameters == null) ? 0 : parameters.hashCode());
        result = prime * result
                + ((selectionStyle == null) ? 0 : selectionStyle.hashCode());
        result = prime * result
                + ((services == null) ? 0 : services.hashCode());
        result = prime * result + ((srs == null) ? 0 : srs.hashCode());
        long temp;
        temp = Double.doubleToLongBits(version);
        result = prime * result + (int) (temp ^ (temp >>> 32));
        return result;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (!(obj instanceof Theme))
            return false;
        Theme other = (Theme) obj;
        if (backgroundColor == null) {
            if (other.backgroundColor != null)
                return false;
        } else if (!backgroundColor.equals(other.backgroundColor))
            return false;
        if (covers == null) {
            if (other.covers != null)
                return false;
        } else if (!covers.equals(other.covers))
            return false;
        if (displayOrder != other.displayOrder)
            return false;
        if (id != other.id)
            return false;
        if (layers == null) {
            if (other.layers != null)
                return false;
        } else if (!layers.equals(other.layers))
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (parameters == null) {
            if (other.parameters != null)
                return false;
        } else if (!parameters.equals(other.parameters))
            return false;
        if (selectionStyle == null) {
            if (other.selectionStyle != null)
                return false;
        } else if (!selectionStyle.equals(other.selectionStyle))
            return false;
        if (services == null) {
            if (other.services != null)
                return false;
        } else if (!services.equals(other.services))
            return false;
        if (srs == null) {
            if (other.srs != null)
                return false;
        } else if (!srs.equals(other.srs))
            return false;
        if (Double.doubleToLongBits(version) != Double
                .doubleToLongBits(other.version))
            return false;
        return true;
    }

    /**
     * Get the spatial reference system key.
     * 
     * @return The spatial reference system key.
     */
    public String getSRS() {
        return this.srs;
    }

    /**
     * Set the spatial reference system key.
     * 
     * @param srs
     *            The spatial reference system key.
     */
    public void setSRS(String srs) {
        this.srs = srs;
    }

    /**
     * Returns the position object.
     * 
     * @return the position
     */
    public Position getPosition() {
        return position;
    }

    /**
     * Sets the position object.
     * 
     * @param position
     *            the position to set
     */
    public void setPosition(Position position) {
        this.position = position;
    }

    /**
     * Return the path to the legend.
     * 
     * @return The path to the legend
     */
    public String getLegend() {
        return legend;
    }

    /**
     * Set the path to the legend.
     * 
     * @param legend
     *            The path to the legend.
     */
    public void setLegend(String legend) {
        this.legend = legend;
    }    

}