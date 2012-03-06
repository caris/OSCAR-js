/*
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
/**
 * Class: oscar.Util.Transform
 * 
 * Provides xslt transformation for xml documents. 
 * 
 * Usage:
 *  var results = oscar.Util.Transform.transform(xml,xsl);
 *  
 *  
 */

oscar.Util.Transform = {
	/**
	 * APIMethod: transform
	 * Transforms an xml node based on the rules passed in by the xsl stylesheet.
	 * 
	 * Parameters:
	 * 
	 * xml - The xml node.
	 * xsl - The xsl stylesheet.
	 * 
	 * Returns:
	 *  {String} (if IE) or {Element}
	 */
	transform : function(xml, xsl) {
		try {
			var processor = new XSLTProcessor();
			processor.importStylesheet(xsl);
			var ex = processor.transformToFragment(xml, document);
			return ex;
		} catch (err) {
			var ex = xml.transformNode(xsl);
			return ex;
		}
	}
};