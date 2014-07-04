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
package com.caris.oscarexchange4j.theme.services;

import java.util.List;

public interface Service {
    /**
     * enum of service types.
     */
    public enum ServiceType {
        SERVICE, SELECTION, EXTRACTION, CATALOGUE
    };

    /**
     * Returns the type of service.
     * @return ServiceType SERVICE, SELECTION, or EXTRACTION, as appropriate.
     */
    public abstract ServiceType getServiceType();

    /**
     * Returns a list of ServiceEntry objects that are registered with this service.
     * @return List<ServiceEntry> The ServiceEntry objects registered with this service.
     *                  Returns null if no ServiceEntries are present.
     */
    public abstract List<ServiceEntry> getServiceEntries();

    /**
     * Registers a ServiceEntry object with this Service. If no entries exist it
     * creates a new list of entries.
     * @param entry The entry to add.
     */
    public abstract void addServiceEntry(ServiceEntry entry);

}
