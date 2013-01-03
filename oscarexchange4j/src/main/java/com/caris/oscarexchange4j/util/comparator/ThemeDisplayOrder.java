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
package com.caris.oscarexchange4j.util.comparator;

import java.io.Serializable;
import java.util.Comparator;

import com.caris.oscarexchange4j.theme.Theme;
/*
 * WEB-1002 - Implemented Serializable interface.
 */

/**
 * @author tcoburn
 *
 */
public class ThemeDisplayOrder implements Serializable, Comparator<Theme> {

    /**
     * Serialization member
     */
    private static final long serialVersionUID = 158439850478647219L;

    @Override
	public int compare(Theme t1, Theme t2) {
		if (t1.getDisplayOrder() < t2.getDisplayOrder())
			return -1;
		else if  (t1.getDisplayOrder() > t2.getDisplayOrder())
			return 1;
		else
			return 0;
	}

}
