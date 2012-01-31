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

package com.caris.oscarexchange4j.theme.services;

import java.util.ArrayList;

public class ServiceEntry {
    /**
     * the URL for the service
     */
    private String url;

    /**
     * the type of service (WFS, WMTS, etc.)
     */
    private String serviceType;

    /**
     * The version of the serviceType
     */
    private String version;

    /**
     * The format of the service (JSON, KML, GML2, etc.)
     */
    private String format;
    
    /**
     * The service identifiers (featureTypes, coverages, etc.)
     */
    private ArrayList<String> identifiers;

    /**
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * @param url
     *            the url to set
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * @return the serviceType
     */
    public String getServiceType() {
        return serviceType;
    }

    /**
     * @param serviceType
     *            the serviceType to set
     */
    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    /**
     * @return the version
     */
    public String getVersion() {
        return version;
    }

    /**
     * @param version
     *            the version to set
     */
    public void setVersion(String version) {
        this.version = version;
    }

    /**
     * @return the format
     */
    public String getFormat() {
        return format;
    }

    /**
     * @param format
     *            the format to set
     */
    public void setFormat(String format) {
        this.format = format;
    }
    
    /**
     * @return the identifiers
     */
    public ArrayList<String> getIdentifiers() {
        return identifiers;
    }

    /**
     * @param identifiers
     *            the identifiers to set
     */
    public void setIdentifiers(ArrayList<String> identifiers) {
        this.identifiers = identifiers;
    }

    /**
     * Add an identifier to the identifiers list
     * @param identifier The String identifier
     */
    public void addIdentifier(String identifier) {
        if (this.identifiers == null)
            this.identifiers = new ArrayList<String>();
        this.identifiers.add(identifier);
            
    }
    
}
