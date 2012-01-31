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
     * @param type
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
     * @param id
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @param maxX
     */
    public void setMaxX(double maxX) {
        this.maxX = maxX;
    }

    /**
     * @param maxY
     */
    public void setMaxY(double maxY) {
        this.maxY = maxY;
    }

    /**
     * @param minX
     */
    public void setMinX(double minX) {
        this.minX = minX;
    }

    /**
     * @param minY
     */
    public void setMinY(double minY) {
        this.minY = minY;
    }
}
