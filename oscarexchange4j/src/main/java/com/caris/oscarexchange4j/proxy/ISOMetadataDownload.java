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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

/**
 * Proxy class for handling.
 * 
 * @author tcoburn
 *
 */
public class ISOMetadataDownload extends ISOMetadataRequest {

    /**
     * The filename to use during download.
     */
    private String fileName;

    /**
     * Constructor
     * 
     * @param request
     *            The servlet request.
     * @param response
     *            The servlet response.
     */
    public ISOMetadataDownload(HttpServletRequest request,
            HttpServletResponse response) {
        super(request, response);
    }

    @Override
    void transform() throws Exception {

        DOMSource source = new DOMSource(this.document);
        TransformerFactory tFactory = TransformerFactory.newInstance();
        tFactory.newTransformer().transform(source,
                new StreamResult(this.getOutputStream()));
    }

    @Override
    void setResponseHeaders() {

        HttpServletResponse resp = this.getResponse();
        resp.setContentType(this.getRequest().getContentType());
        resp.setHeader("Expires", "0");
        resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        resp.setHeader("Pragma", "no-cache");
        this.getRequest().getHeader("Content-Disposition");
        resp.setHeader("Content-Disposition",
                "attachment;filename=" + this.getFileName());

    }

    /**
     * Set the filename to use when adjusting the content disposition.
     * 
     * @param fileName
     */
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    /**
     * Returns the filename.
     * 
     * @return The filename.
     */
    private String getFileName() {
        return this.fileName;
    }

}
