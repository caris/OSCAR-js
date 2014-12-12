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
public class ISOMetadataViewTest {
    private HttpServletRequest request;

    private HttpServletResponse response;

    @Before
    public void setup() throws IOException {
        request = EasyMock.createMock(HttpServletRequest.class);
        response = EasyMock.createMock(HttpServletResponse.class);

        //EasyMock.expect(request.getHeader((String) EasyMock.anyObject())).andReturn("");
        EasyMock.expect(response.getOutputStream()).andReturn(new ServletOutputStream() {
            
            @Override
            public void write(int b) throws IOException {
                // TODO Auto-generated method stub
                
            }
        });
        response.setContentType("text/html");
       
        EasyMock.expectLastCall().anyTimes();
        EasyMock.replay(request, response);
    }

    @Test
    public void view() throws Exception {
        ISOMetadataView proxy = new ISOMetadataView(request, response);
        proxy.openConnection(getClass().getResource("/getrecordbyid.xml"));
        EasyMock.verify(response,request);
        
    }

}
