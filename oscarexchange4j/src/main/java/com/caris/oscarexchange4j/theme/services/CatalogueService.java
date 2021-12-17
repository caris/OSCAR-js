/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2021 CARIS <http://www.caris.com>
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

public class CatalogueService extends I_Service {

    /**
     * The attribute name for the output schema
     */
    public final static String OUTPUT_SCHEMA = "outputSchema";

    /**
     * The attribute value for the default output schema.
     */
    public final static String DEFAULT_OUTPUT_SCHEMA = "http://www.opengis.net/cat/csw/2.0.2";

    /*
     * (non-Javadoc)
     * 
     * @see com.caris.oscarexchange4j.theme.services.I_Service#getServiceType()
     */
    @Override
    public ServiceType getServiceType() {
        return Service.ServiceType.CATALOGUE;
    }

}
