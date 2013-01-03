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
package com.caris.oscarexchange4j.theme.interfaces;

/*
 * WEB-999 - Interface added to define methods used by web feature service layers.
 */

/**
 * Interface to define methods used by Web Feature Service layers.
 * 
 * @author tcoburn
 * 
 */
public interface WebFeatureService {
    /**
     * Returns the Web Feature Service version
     * 
     * @return String
     */
    public String getWFSVersion();

    /**
     * Sets the Web Feature Service version
     * 
     * @param wfsVersion
     */
    public void setWFSVersion(String wfsVersion);

    /**
     * Returns the Web Feature Service output format.
     * 
     * @return String
     */
    public String getResponseFormat();

    /**
     * Sets the Web Feature Service output format
     * 
     * @param responseFormat
     */
    public void setResponseFormat(String responseFormat);

}
