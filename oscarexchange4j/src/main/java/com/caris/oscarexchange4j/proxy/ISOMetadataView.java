/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2014 CARIS <http://www.caris.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.caris.oscarexchange4j.proxy;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

/**
 * 
 * 
 * @author tcoburn
 *
 */
public class ISOMetadataView extends ISOMetadataRequest {

    /**
     * The transformer
     */
    private Transformer transformer;

    /**
     * @param request
     * @param response
     */
    public ISOMetadataView(HttpServletRequest request,
            HttpServletResponse response) {
        super(request, response);
    }

    /**
     * Sets the transformer to be used.
     * 
     * @param transformer
     *            The transformer
     */
    public void setTransformer(Transformer transformer) {
        this.transformer = transformer;
    }

    /**
     * Get the transformer for converting the document.
     * 
     * @return The transformer
     * @throws IOException
     *             Thrown if something goes wrong.
     */
    private Transformer getTransformer() throws Exception {
        if (this.transformer != null) {
            return this.transformer;
        }
        try (InputStream is = getClass().getResourceAsStream("/isoToHtml.xsl")) {
            return TransformerFactory.newInstance().newTransformer(
                    new StreamSource(is));
        }
    }

    @Override
    void transform() throws Exception {
        DOMSource source = new DOMSource(this.document);
        this.getTransformer().transform(source,
                new StreamResult(this.getOutputStream()));
    }

    @Override
    void setResponseHeaders() {
        this.getResponse().setContentType("text/html");
    }
}
