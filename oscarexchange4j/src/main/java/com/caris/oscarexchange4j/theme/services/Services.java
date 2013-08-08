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
package com.caris.oscarexchange4j.theme.services;

import java.util.ArrayList;
import java.util.List;

import com.caris.oscarexchange4j.theme.services.Service.ServiceType;

public class Services {
    private List<SelectionService> selection;

    private List<ExtractionService> extraction;

    /**
     * @param selection
     *            the selection to set
     */
    public void setSelection(List<SelectionService> selection) {
        this.selection = selection;
    }

    /**
     * @return the selection
     */
    public List<SelectionService> getSelection() {
        return selection;
    }

    public void addService(Service service) {
        if (service.getServiceType() == I_Service.ServiceType.SELECTION)
            this.addSelectionService((SelectionService) service);
        else if (service.getServiceType() == I_Service.ServiceType.EXTRACTION)
            this.addExtractionService((ExtractionService) service);
    }

    /* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((extraction == null) ? 0 : extraction.hashCode());
		result = prime * result
				+ ((selection == null) ? 0 : selection.hashCode());
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (!(obj instanceof Services))
			return false;
		Services other = (Services) obj;
		if (extraction == null) {
			if (other.extraction != null)
				return false;
		} else if (!extraction.equals(other.extraction))
			return false;
		if (selection == null) {
			if (other.selection != null)
				return false;
		} else if (!selection.equals(other.selection))
			return false;
		return true;
	}

	private void addExtractionService(ExtractionService service) {
        if (this.extraction == null)
            this.extraction = new ArrayList<ExtractionService>();
        this.extraction.add(service);

    }

    private void addSelectionService(SelectionService service) {
        if (this.selection == null)
            this.selection = new ArrayList<SelectionService>();

        this.selection.add(service);

    }

    /**
     * @param extraction
     *            the extraction to set
     */
    public void setExtraction(List<ExtractionService> extraction) {
        this.extraction = extraction;
    }

    /**
     * @return the extraction
     */
    public List<ExtractionService> getExtraction() {
        return extraction;
    }

    /**
     * Create a SelectionService or an ExtractionService.
     * @param type The type of service you want to make
     * @return A Service of the requested type.
     */
    public static Service createService(ServiceType type) {
        switch (type) {
        case SELECTION:
            return new SelectionService();
        case EXTRACTION:
            return new ExtractionService();
        }
        return null;
    }

}
