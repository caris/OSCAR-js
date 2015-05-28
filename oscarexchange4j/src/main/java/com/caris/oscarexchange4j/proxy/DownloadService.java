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

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * Proxy service to obtain files from a server.
 * 
 * @author tcoburn
 * 
 */
public class DownloadService implements Reader {

    /**
     * Url to be used when making the request.
     */
    private String url;

    /**
     * Map used to store response headers.
     */
    private Map<String, List<String>> responseHeaders;

    /**
     * Sets the url used for the request.
     * 
     * @param url
     *            The URL used for the request.
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Returns the url used for the request.
     * 
     * @return The URL used by this service.
     */
    public String getUrl() {
        return this.url;
    }

    /**
     * Makes a connection to the url, reads the stream into a byte array and
     * returns it
     * 
     * @return byte[] byte array containing the content of the response.
     * @throws Exception
     *             Thrown if there is a problem making a connection to the URL
     *             or reading the data from it.
     */
    public byte[] run() throws Exception {
        URL url = new URL(this.url);
        HttpURLConnection uc = (HttpURLConnection) url.openConnection();
        uc.connect();
        this.responseHeaders = uc.getHeaderFields();
        BufferedInputStream in = new BufferedInputStream(uc.getInputStream());
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();

        int nRead;
        byte[] data = new byte[16384];

        while ((nRead = in.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }

        buffer.flush();
        uc.disconnect();
        return buffer.toByteArray();
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.caris.oscarexchange4j.proxy.Reader#makeRequest(javax.servlet.http
     * .HttpServletRequest)
     */
    @Override
    public Response makeRequest(HttpServletRequest httpServletRequest) {
        return null;
    }

    /**
     * Returns a map containing the headers of the response.
     * 
     * @return Returns a map containing the headers of the response.
     */
    public Map<String, List<String>> getResponseHeaders() {
        return responseHeaders;
    }
}
