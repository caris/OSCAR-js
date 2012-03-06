/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2012 CARIS <http://www.caris.com>
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

import java.awt.Color;

/**
 * This class represents the configuration for selection in Oscar
 * 
 * @author jbourgeois
 * 
 */
public class SelectionStyle {
    /**
     * color of features
     */
    private Color featureColor;

    /**
     * color of selected features
     */
    private Color selectedFeatureColor;
    
    /**
     * no-args constructor
     */
    public SelectionStyle(){}
    
    /**
     * Two-arg constructor for convenience
     * @param featureColor Color of features
     * @param selectedFeatureColor Color of selected features
     */
    public SelectionStyle(Color featureColor, Color selectedFeatureColor) {
        this.featureColor = featureColor;
        this.selectedFeatureColor = selectedFeatureColor;
    }

    /**
     * set featureColor
     * @param Color featureColor
     */
    public void setFeatureColor(Color featureColor) {
        this.featureColor = featureColor;
    }

    /**
     * get featureColor
     * @return Color featureColor
     */
    public Color getFeatureColor() {
        return featureColor;
    }

    /**
     * set selectedFeatureColor
     * @param Color selectedFeatureColor
     */
    public void setSelectedFeatureColor(Color selectedFeatureColor) {
        this.selectedFeatureColor = selectedFeatureColor;
    }

    /**
     * get selectedFeatureColor
     * @return Color selectedFeatureColor
     */
    public Color getSelectedFeatureColor() {
        return selectedFeatureColor;
    }

	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((featureColor == null) ? 0 : featureColor.hashCode());
		result = prime
				* result
				+ ((selectedFeatureColor == null) ? 0 : selectedFeatureColor
						.hashCode());
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
		if (!(obj instanceof SelectionStyle))
			return false;
		SelectionStyle other = (SelectionStyle) obj;
		if (featureColor == null) {
			if (other.featureColor != null)
				return false;
		} else if (!featureColor.equals(other.featureColor))
			return false;
		if (selectedFeatureColor == null) {
			if (other.selectedFeatureColor != null)
				return false;
		} else if (!selectedFeatureColor.equals(other.selectedFeatureColor))
			return false;
		return true;
	}

}
