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
 * This class represents a latitude, longitude, zoom level position in Oscar.
 * 
 * @author tcoburn
 *
 */
public class Position {
    /**
     * The latitude position.
     */
    private double latitude;

    /**
     * The longitude position.
     */
    private double longitude;

    /**
     * The zoom level.
     */
    private int zoom;

    /**
     * Gets the latitude.
     * 
     * @return the latitude
     */
    public double getLatitude() {
        return latitude;
    }

    /**
     * Sets the latitude.
     * 
     * @param latitude
     *            the latitude to set
     */
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    /**
     * Gets the longitude.
     * 
     * @return the longitude
     */
    public double getLongitude() {
        return longitude;
    }

    /**
     * Sets the longitude.
     * 
     * @param longitude
     *            the longitude to set
     */
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    /**
     * Gets the zoom level.
     * 
     * @return the zoom
     */
    public int getZoom() {
        return zoom;
    }

    /**
     * Sets the zoom level.
     * 
     * @param zoom
     *            the zoom to set
     */
    public void setZoom(int zoom) {
        this.zoom = zoom;
    }

}
