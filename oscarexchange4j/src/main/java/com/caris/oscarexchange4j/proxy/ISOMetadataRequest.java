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
package com.caris.oscarexchange4j.proxy;

import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Base proxy class for requestion ISO Metadata.
 * 
 * @author tcoburn
 *
 */
public abstract class ISOMetadataRequest extends Proxy {

    /**
     * Constructor
     * 
     * @param request
     *            The request
     * @param response
     *            The response
     */
    public ISOMetadataRequest(HttpServletRequest request,
            HttpServletResponse response) {
        super(request, response);
    }

    /**
     * The document.
     */
    protected Document document;

    @Override
    protected void processInputStream(InputStream is) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(is);
        Node firstChild = getFirstChildElement(document.getDocumentElement()
                .getChildNodes());

        Document newDocument = builder.newDocument();
        Node adoptedNode = newDocument.adoptNode(firstChild);
        newDocument.appendChild(adoptedNode);
        this.document = newDocument;

    }

    /**
     * @param childNodes
     *            The child nodes.
     * @return The first element node.
     */
    private Node getFirstChildElement(NodeList childNodes) {
        assert childNodes != null;
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node node = childNodes.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                return node;
            }
        }
        return null;
    }
}
