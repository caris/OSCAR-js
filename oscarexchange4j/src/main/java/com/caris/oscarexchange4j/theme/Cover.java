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

/*
 * WEB-1002 - JavaDocs cleanup
 */
/**
 * This class represent an Oscar Cover
 * 
 * @author tcoburn
 * 
 */
public class Cover {

    private int id;

    private double maxX;

    private double maxY;

    private double minX;

    private double minY;

    private CoverType type;

    /**
     * @return com.caris.oscarexchange4j.theme.CoverType
     */
    public CoverType getType() {
        return type;
    }

    /**
     * Set the type of cover.
     * 
     * @param type
     *            The type of cover.
     */
    public void setType(CoverType type) {
        this.type = type;
    }

    /**
     * @return int
     */
    public int getId() {
        return this.id;
    }

    /**
     * @return double
     */
    public double getMaxX() {
        return this.maxX;
    }

    /**
     * @return double
     */
    public double getMaxY() {
        return this.maxY;
    }

    /**
     * @return double
     */
    public double getMinX() {
        return this.minX;
    }

    /**
     * @return double
     */
    public double getMinY() {
        return this.minY;
    }

    /**
     * Set the cover's identifier.
     * 
     * @param id
     *            The cover's identifier.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Set the cover's maximum X value.
     * 
     * @param maxX
     *            The cover's maximum X value.
     */
    public void setMaxX(double maxX) {
        this.maxX = maxX;
    }

    /**
     * Set the cover's maximum Y value.
     * 
     * @param maxY
     *            The cover's maximum Y value.
     */
    public void setMaxY(double maxY) {
        this.maxY = maxY;
    }

    /**
     * Set the cover's minimum X value.
     * 
     * @param minX
     *            The cover's minimum X value.
     */
    public void setMinX(double minX) {
        this.minX = minX;
    }

    /**
     * Set the cover's minimum Y value.
     * 
     * @param minY
     *            The cover's minimum Y value.
     */
    public void setMinY(double minY) {
        this.minY = minY;
    }
}
