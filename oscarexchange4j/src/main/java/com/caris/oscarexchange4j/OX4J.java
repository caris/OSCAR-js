/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2013 CARIS <http://www.caris.com>
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
package com.caris.oscarexchange4j;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.caris.oscarexchange4j.theme.Theme;
import com.caris.oscarexchange4j.util.OXUtil;

/**
 * This is the parent container class for the configuration properties
 * 
 * @author tcoburn
 * 
 */
public class OX4J {

    /**
     * version member
     */
    static final double defaultVersion = 2.0;

    /**
     * proxy member
     */
    static final String proxy = "proxy?url=";

    /**
     * themes member
     */
    private List<Theme> themes;

    /**
     * Parameters member
     */
    private Map<String, String> parameters;

    private double version;
    
    private boolean prettyPrinting;

    public OX4J() {
        this.version = OX4J.defaultVersion;
    }
    public OX4J(double version) {
        this.version = version;
    }

    /**
     * Returns a list of themes.
     * @return java.util.List
     */
    public List<Theme> getThemes() {
        return this.themes;
    }

    /**
     * Returns the version.
     * @return double
     */
    public double getVersion() {
        return this.version;
    }

    /**
     * Sets the list of themes.
     * @param themes
     */
    public void setThemes(List<Theme> themes) {
        this.themes = themes;
    }

    /**
     * Called when sorting the themes.
     * @param c
     */
    public void sortThemes(Comparator<Theme> c) {
        Collections.sort(this.themes, c);
    }

    /*
     * Changed how the Gson object is created
     */
    /**
     * Creates a JSON serialized version of the object.
     * @return java.lang.String
     */
    public String toJson() {
        return OXUtil.createGsonBuilder(this.getPrettyPrinting()).toJson(this);
    }
    /**
     * Returns the proxy member.
     * @return java.lang.String
     */
    public String getProxy() {
        return proxy;
    }

    /**
     * Sets a map of parameters.
     * @param parameters
     *            the parameters to set
     */
    public void setParameters(Map<String, String> parameters) {
        this.parameters = parameters;
    }

    /**
     * Returns a map of parameters.
     * @return Map<String,String>
     */
    public Map<String, String> getParameters() {
        return parameters;
    }
    
    /**
     * @param doPrettyPrinting the doPrettyPrinting to set
     */
    public void setPrettyPrinting(boolean prettyPrinting) {
        this.prettyPrinting = prettyPrinting;
    }
    /**
     * @return the doPrettyPrinting
     */
    public boolean getPrettyPrinting() {
        return prettyPrinting;
    }

    /**
     * Adds a single parameter.
     * @param key
     * @param value
     */
    public void addParameter(String key, String value) {
        if (this.parameters == null)
            this.parameters = new HashMap<String, String>();
        this.parameters.put(key, value);
    }

    /**
     * Adds a single theme.
     * @param theme
     */
    public void addTheme(Theme theme) {
        if (this.themes == null) {
            this.themes = new ArrayList<Theme>();
        }
        this.themes.add(theme);

    }

}
