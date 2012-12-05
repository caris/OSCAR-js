/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2012 CARIS <http://www.caris.com>
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

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

/**
 * @author tcoburn
 * 
 */
public class URLReader implements Reader {
    /**
     * This is the logger object.
     */
    Logger log = Logger.getLogger(this.getClass().getName());

    /**
     * The url object used for the request
     */
    private URL url;

    /**
     * This is a constructor for the URLReader class
     * 
     * @param url
     * @throws MalformedURLException
     */
    public URLReader(String connectionString) throws MalformedURLException { // replace
                                                                             // spaces
                                                                             // with
                                                                             // %20
        connectionString = connectionString.replace(" ", "%20");
        this.url = new URL(connectionString);
    }

    /**
     * This is a constructor for the URLReader class
     * 
     * @param url
     */
    public URLReader(URL url) {
        this.url = url;
    }

    /**
     * Returns an HttpConnection object based on the classes URL.
     * 
     * @return
     * @throws IOException
     */
    public HttpURLConnection getConnection() throws IOException {
        return (HttpURLConnection) this.url.openConnection();
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.caris.oscarexchange4j.proxy.Reader#makeRequest(javax.servlet.http
     * .HttpServletRequest)
     */
    @Override
    public Response makeRequest(HttpServletRequest request) {
        Response resp = new Response();
        BufferedInputStream webToProxyBuf = null;
        HttpURLConnection con;

        try {
            int oneByte;
            String methodName;
            String urlString = encodeSpaces(request.getParameter("url"));

            // encoding any space characters with %20
            URL url = new URL(urlString);
            con = (HttpURLConnection) url.openConnection();

            methodName = request.getMethod();
            con.setRequestMethod(methodName);
            con.setDoOutput(true);
            con.setDoInput(true);
            HttpURLConnection.setFollowRedirects(false);
            con.setUseCaches(true);

            for (Enumeration<String> e = request.getHeaderNames(); e
                    .hasMoreElements();) {
                String headerName = e.nextElement().toString();
                // When the request is forwarded, copying the current host
                // header field in the servletRequest will cause
                // a valid host header field
                if (!headerName.equals("accept-encoding")
                        && !headerName.equals("host")) {
                    con.setRequestProperty(headerName,
                            request.getHeader(headerName));
                }
            }

            con.connect();

            if (methodName.equals("POST")) {
                BufferedInputStream clientToProxyBuf = new BufferedInputStream(
                        request.getInputStream());
                BufferedOutputStream proxyToWebBuf = new BufferedOutputStream(
                        con.getOutputStream());

                while ((oneByte = clientToProxyBuf.read()) != -1)
                    proxyToWebBuf.write(oneByte);

                proxyToWebBuf.flush();
                proxyToWebBuf.close();
                clientToProxyBuf.close();
            }

            resp.setContentType(con.getContentType());
            StringBuffer input = new StringBuffer();
            BufferedReader in = null;
            try {
                in = new BufferedReader(new InputStreamReader(
                        con.getInputStream()));
                String line = null;

                while ((line = in.readLine()) != null) {
                    input.append(line);
                    input.append(System.getProperty("line.separator"));
                }
            } catch (IOException e) {
                log.error("Error attempting to read from the resource.", e);
            } finally {
                try {
                    if (in != null) {
                        in.close();
                    }
                } catch (IOException e) {
                    log.error("Error attempting to close the connection.", e);
                }
            }
            if (webToProxyBuf != null) {
                webToProxyBuf.close();
            }
            con.disconnect();
            resp.setBytes(input.toString().getBytes());

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        } finally {
        }
        return resp;
    }

    /**
     * 
     * @param url
     *            The url to encode
     * @return A string with the spaces encoded with %20
     */
    protected String encodeSpaces(String url) {
        return url.replace(" ", "%20");
    }

}
