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
package com.caris.oscarexchange4j.theme.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ServiceEntry {

    /**
     * Attributes for the service entry.
     */
    Map<String, String> attributes;

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
     * Returns the attributes set for the service entry.
     * 
     * @return The service entry attributes.
     */
    public Map<String, String> getAttributes() {
        return attributes;
    }

    /**
     * Adds an attribute to the attributes map.
     * 
     * @param name
     *            The name of the attribute.
     * @param value
     *            The value of the attribute.
     */
    public void addAttribute(String name, String value) {
        if (this.attributes == null)
            this.attributes = new HashMap<String, String>();
        this.attributes.put(name, value);
    }

    /**
     * Set the service URL.
     * 
     * @param url
     *            The service URL.
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Get the service type.
     * 
     * @return The service type.
     */
    public String getServiceType() {
        return serviceType;
    }

    /**
     * Set the service type.
     * 
     * @param serviceType
     *            The service type.
     */
    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    /**
     * Get the service entry version.
     * 
     * @return The service entry version.
     */
    public String getVersion() {
        return version;
    }

    /**
     * Set the service entry version.
     * 
     * @param version
     *            The service entry version.
     */
    public void setVersion(String version) {
        this.version = version;
    }

    /**
     * Get the format.
     * 
     * @return The format.
     */
    public String getFormat() {
        return format;
    }

    /**
     * Set the format.
     * 
     * @param format
     *            The format.
     */
    public void setFormat(String format) {
        this.format = format;
    }

    /**
     * Get the identifiers.
     * 
     * @return The list of identifiers.
     */
    public ArrayList<String> getIdentifiers() {
        return identifiers;
    }

    /**
     * Set the identifiers.
     * 
     * @param identifiers
     *            The identifiers.
     */
    public void setIdentifiers(ArrayList<String> identifiers) {
        this.identifiers = identifiers;
    }

    /**
     * Add an identifier to the identifiers list
     * 
     * @param identifier
     *            The String identifier
     */
    public void addIdentifier(String identifier) {
        if (this.identifiers == null)
            this.identifiers = new ArrayList<String>();
        this.identifiers.add(identifier);

    }

}
