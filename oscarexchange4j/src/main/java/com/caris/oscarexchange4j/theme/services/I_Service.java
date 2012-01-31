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
import java.util.List;

public class I_Service implements Service {

    /**
     * The list of ServiceEntry objects registered with this Service.
     */
    private List<ServiceEntry> serviceEntries;

    /* (non-Javadoc)
     * @see com.caris.oscarexchange4j.theme.services.Service#getServiceEntries()
     */
    @Override
    public List<ServiceEntry> getServiceEntries() {
        return this.serviceEntries;
    }

    /* (non-Javadoc)
     * @see com.caris.oscarexchange4j.theme.services.Service#addServiceEntry(com.caris.oscarexchange4j.theme.services.ServiceEntry)
     */
    @Override
    public void addServiceEntry(ServiceEntry entry) {
        if (this.serviceEntries == null) {
            this.serviceEntries = new ArrayList<ServiceEntry>();
        }
        this.serviceEntries.add(entry);
    }

    /* (non-Javadoc)
     * @see com.caris.oscarexchange4j.theme.services.Service#getServiceType()
     */
    @Override
    public ServiceType getServiceType() {
        return I_Service.ServiceType.SERVICE;

    }
}
