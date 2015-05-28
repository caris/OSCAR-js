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

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This is a base proxy class.
 * 
 * @author tcoburn
 *
 */
public abstract class Proxy {

    /**
     * The servlet request
     */
    private HttpServletRequest request;

    /**
     * The servlet response
     */
    private HttpServletResponse response;

    /**
     * Constructor
     * 
     * @param request
     *            The servlet request.
     * @param response
     *            The servlet response.
     */
    public Proxy(HttpServletRequest request, HttpServletResponse response) {
        this.request = request;
        this.response = response;
    }

    /**
     * This method opens a connection to the provided url.
     * 
     * @param url
     *            The URL.
     * @throws Exception Thrown if something goes wrong.
     */
    public void openConnection(URL url) throws Exception {
        URLConnection connection = null;
        try {
            connection = url.openConnection();

        } finally {
            try (InputStream is = connection.getInputStream()) {
                processInputStream(is);
                setResponseHeaders();
                transform();
            }
        }

    }

    /**
     * Called by subclasses to configure response headers.
     */
    abstract void setResponseHeaders();

    /**
     * Returns the servlet request.
     * 
     * @return the request
     */
    public HttpServletRequest getRequest() {
        return request;
    }

    /**
     * Returns the response.
     * 
     * @return the response
     */
    public HttpServletResponse getResponse() {
        return response;
    }

    /**
     * Called to perform transformation output
     * 
     * @throws Exception
     *             Thrown if a problem occurs.
     */
    abstract void transform() throws Exception;

    /**
     * Implemented by sub classes to handle the input stream from the url.
     * 
     * @param is
     *            The input stream.
     * @throws Exception
     *             Thrown if a problem occurs.
     */
    abstract void processInputStream(InputStream is) throws Exception;

    /**
     * Returns the output stream of the servlet response to allow direct
     * writing.
     * 
     * @return The response output stream.
     * @throws IOException
     *             Thrown if a problem occurs.
     */
    protected OutputStream getOutputStream() throws IOException {
        return this.response.getOutputStream();
    }
}