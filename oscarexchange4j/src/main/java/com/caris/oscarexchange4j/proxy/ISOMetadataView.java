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

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

public class ISOMetadataView extends ISOMetadataRequest {

    public ISOMetadataView(HttpServletRequest request,
            HttpServletResponse response) {
        super(request, response);
    }

    public InputStream getTransformer() {
        return getClass().getResourceAsStream("/isoToHtml.xsl");
    }

    @Override
    void transform() throws Exception {
        DOMSource source = new DOMSource(this.document);
        try (InputStream is = getTransformer()) {
            Transformer transformer = TransformerFactory.newInstance()
                    .newTransformer(new StreamSource(is));

            transformer.transform(source,
                    new StreamResult(this.getOutputStream()));
        }

    }

    @Override
    void setResponseHeaders() {
        this.getResponse().setContentType("text/html");
    }
}
