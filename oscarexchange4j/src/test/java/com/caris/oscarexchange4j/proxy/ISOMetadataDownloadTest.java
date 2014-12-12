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

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.easymock.EasyMock;
import org.junit.Before;
import org.junit.Test;

/**
 * @author tcoburn
 *
 */
public class ISOMetadataDownloadTest {

    /**
     * The request object
     */
    private HttpServletRequest request;

    /**
     * The response object
     */
    private HttpServletResponse response;

    /**
     * Set up method
     * 
     * @throws IOException
     */
    @Before
    public void setup() throws IOException {
        request = EasyMock.createMock(HttpServletRequest.class);
        response = EasyMock.createMock(HttpServletResponse.class);

        EasyMock.expect(request.getHeader((String) EasyMock.anyObject()))
                .andReturn("");
        EasyMock.expect(request.getContentType()).andReturn("application/xml");
        response.setContentType("application/xml");
        response.setHeader("Expires", "0");
        response.setHeader("Cache-Control",
                "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Content-Disposition",
                "attachment;filename=test.xml");

        EasyMock.expect(response.getOutputStream()).andReturn(
                new ServletOutputStream() {
                    @Override
                    public void write(int b) throws IOException {

                    }
                });

        EasyMock.replay(request, response);
    }

    /**
     * Tests that the headers are set correctly
     * 
     * @throws Exception
     *             if something goes boom.
     */
    @Test
    public void download() throws Exception {
        ISOMetadataDownload proxy = new ISOMetadataDownload(request, response);
        proxy.setFileName("test.xml");
        proxy.openConnection(getClass().getResource("/getrecordbyid.xml"));
        EasyMock.verify(response, request);

    }

}
