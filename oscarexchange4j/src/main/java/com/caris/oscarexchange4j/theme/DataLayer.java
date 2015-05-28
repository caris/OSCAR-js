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

/**
 * This class represents an Oscar DataLayer
 * 
 * @author tcoburn
 * 
 */
public class DataLayer {
    /**
     * id member
     */
    private int id;

    /**
     * layerName memeber
     */
    private String layerName;

    /**
     * index member
     */
    private int index;

    /**
     * no-args constructor
     */
    public DataLayer() {
    }

    /**
     * Create a data layer with a given name.
     * 
     * @param layerName
     *            The data layer layer name.
     */
    public DataLayer(String layerName) {
        super();
        this.layerName = layerName;
    }

    /**
     * Create a data layer with an index and name.
     * 
     * @param index
     *            The data layer index.
     * @param layerName
     *            The data layer layer name.
     */
    public DataLayer(int index, String layerName) {
        super();
        this.index = index;
        this.layerName = layerName;
    }

    /**
     * Create a data layer with an id, index and name.
     * 
     * @param id
     *            The data layer identifier.
     * @param index
     *            The data layer index.
     * @param layerName
     *            The data layer layer name.
     */
    public DataLayer(int id, int index, String layerName) {
        super();
        this.id = id;
        this.index = index;
        this.layerName = layerName;
    }

    /**
     * Get the data layer identifier.
     * 
     * @return The data layer identifier.
     */
    public int getId() {
        return id;
    }

    /**
     * Set the identifier for the data layer.
     * 
     * @param id
     *            The identifier for the data layer.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Get the layer name.
     * 
     * @return The layer name.
     */
    public String getLayerName() {
        return layerName;
    }

    /**
     * Set the layer name for the data layer.
     * 
     * @param layerName
     *            The layer name for the data layer.
     */
    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    /**
     * Set the index for the data layer.
     * 
     * @param index
     *            The index for the data layer.
     */
    public void setIndex(int index) {
        this.index = index;
    }

    /**
     * Get the index for the data layer.
     * 
     * @return The index for the data layer.
     */
    public int getIndex() {
        return index;
    }

}
