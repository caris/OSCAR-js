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
package com.caris.oscarexchange4j.theme;

import com.caris.oscarexchange4j.theme.exceptions.ValidationException;

import junit.framework.TestCase;

/**
 * @author tcoburn This is a test class for a WMTS layer.
 * 
 */
public class TestWMTS extends TestCase {
	/**
	 * Testing the default request type
	 */
	public void testDefaultRequestType() {
		WMTS wmts = new WMTS();
		assertTrue(wmts.getRequestType().equals(WMTS.REST));
	}

	/**
	 * Test setting the request type
	 */
	public void testSetRequestType() {
		WMTS wmts = new WMTS();
		wmts.setRequestType(WMTS.KVP);
		assertTrue(wmts.getRequestType().equals(WMTS.KVP));
	}


	/**
	 * Testing the validation method
	 */
	public void testValidateIsFalse() {
		WMTS wmts = new WMTS();
		boolean valid = false;
		try {
			valid = wmts.validate();
		} catch (ValidationException e) {
			valid = false;
		}
		assertFalse(valid);
	}
	
	public void testMinimalConstructor() throws ValidationException {
		String url = "http://sfs.caris.com/spatialfusionserver/services/ows/wmts";
		WMTS wmts = new WMTS(url, WMTS.REST);
		wmts.setName("Frederiction (Buildings)");
		wmts.setFormat("image/png");
		wmts.addDataLayer(new DataLayer("Buildings"));
		wmts.setSRS("EPSG:900913");
		assertTrue(wmts.validate());
	}
	
	
}
