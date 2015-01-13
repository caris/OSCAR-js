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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.easymock.EasyMock;
import org.junit.Test;

/**
 * @author tcoburn
 *
 */
public class PreviewCoverageTest {

    /**
     * The service endpoint.
     */
    String serviceEndpoint = "http://localhost/spatialfusionserver/services/ows/wcs/thor-wcs";

    /**
     * The identifier
     */
    String identifier = "Thor.02000005";;

    /**
     * The bbox value
     */
    String bbox = "-13717294.727384,4565132.9021464,-13643915.18024,4591847.6435284";

    /**
     * The range subject
     */
    String rangeSubset = "Depth:cubic";

    /**
     * The resolution
     */
    String gridOffsets = "38.218514137268066,-38.218514137268066";

    /**
     * Tests that the PreviewCoverage proxy writes the image correctly.
     * 
     * @throws Exception
     */
    @Test
    public void execute() throws Exception {

        final ByteArrayOutputStream baos = new ByteArrayOutputStream();
        HttpServletRequest request = EasyMock
                .createMock(HttpServletRequest.class);
        HttpServletResponse response = EasyMock
                .createMock(HttpServletResponse.class);
        EasyMock.expect(response.getOutputStream()).andReturn(
                new ServletOutputStream() {

                    @Override
                    public void write(int b) throws IOException {
                        baos.write(b);
                    }
                });
        response.setContentType(PreviewCoverage.OUTPUT_MIME_TYPE);
        EasyMock.expectLastCall().anyTimes();
        EasyMock.replay(request, response);
        PreviewCoverage action = new PreviewCoverage(request, response);
        action.openConnection(getClass().getResource("/thor-wcs"));
        assertEquals(98650, baos.size());
    }

    /**
     * Test the expected result of generating a url.
     * 
     * @throws Exception
     */
    public void generateUrl() throws Exception {
        String expected = "http://localhost/spatialfusionserver/services/ows/wcs/thor-wcs?GridOffsets=38.218514137268066,-38.218514137268066&store=false&BoundingBox=-13717294.727384,4565132.9021464,-13643915.18024,4591847.6435284,urn:ogc:def:crs:EPSG::900913&FORMAT=image/png&request=GetCoverage&service=WCS&identifier=Thor.02000005&GridBaseCRS=urn:ogc:def:crs:EPSG::900913&gridType=urn:ogc:def:method:WCS:1.1:2dSimpleGrid&version=1.1.0";
        HashMap<String, String> parameterMap = new HashMap<>();
        parameterMap.put(PreviewCoverage.REQUEST, "GetCoverage");
        parameterMap.put(PreviewCoverage.GRIDOFFSETS, this.gridOffsets);
        parameterMap.put(PreviewCoverage.BOUNDINGBOX, this.bbox);
        parameterMap.put(PreviewCoverage.GRIDBASECRS,
                "urn:ogc:def:crs:EPSG::900913");
        parameterMap.put(PreviewCoverage.IDENTIFIER, this.identifier);
        parameterMap.put(PreviewCoverage.SERVICEVERSION, "1.1.0");
        assertTrue(expected.equals(PreviewCoverage.generateUrl(serviceEndpoint,
                parameterMap).toString()));
    }

}
