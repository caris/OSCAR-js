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
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.mail.BodyPart;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

/**
 * This class is a proxy class for real time get coverage requests extracting
 * the image and returning it in the output stream.
 * 
 * @author tcoburn
 *
 */
public class PreviewCoverage extends Proxy {

    /**
     * The expected outgoing mime type as image/png supports transparency.
     */
    public static final String OUTPUT_MIME_TYPE = "image/png";

    /**
     * The expected incoming mime type.
     */
    public static final String MULTI_PART_MIME_TYPE = "multipart/mixed;boundary=End";

    /**
     * The request key name.
     */
    public static final String REQUEST = "request";

    /**
     * The gridbase crs key name.
     */
    public static final String GRIDBASECRS = "GridBaseCRS";

    /**
     * The identifier key name.
     */
    public static final String IDENTIFIER = "identifier";

    /**
     * The bounding box key name.
     */
    public static final String BOUNDINGBOX = "BoundingBox";

    /**
     * The range subset key name.
     */
    public static final String RANGESUBSET = "RangeSubset";

    /**
     * The grid offsets key name.
     */
    public static final String GRIDOFFSETS = "GridOffsets";

    /**
     * The service version key name.
     */
    public static final String SERVICEVERSION = "version";

    /**
     * The store key name.
     */
    private static final String STORE = "store";

    /**
     * The expected store value.
     */
    private static final String STORE_VALUE = "false";

    /**
     * The format key name.
     */
    private static final String FORMAT = "FORMAT";

    /**
     * The expected format.
     */
    private static final String EXPECTED_FORMAT = "image/png";

    /**
     * The grid type key name.
     */
    private static final String GRIDTYPE = "gridType";

    /**
     * The exepected gridtype value.
     */
    private static final String EXPECTED_GRIDTYPE = "urn:ogc:def:method:WCS:1.1:2dSimpleGrid";

    /**
     * The service key name.
     */
    private static final String SERVICE = "service";

    /**
     * The expected service value.
     */
    private static final String SERVICE_VALUE = "WCS";

    /**
     * The input stream
     */
    private InputStream inputStream;

    /**
     * Constructor
     * 
     * @param request
     *            The request.
     * @param response
     *            The response.
     */
    public PreviewCoverage(HttpServletRequest request,
            HttpServletResponse response) {
        super(request, response);
    }

    @Override
    void setResponseHeaders() {
        this.getResponse().setContentType(OUTPUT_MIME_TYPE);
    }

    @Override
    public void processInputStream(InputStream is) throws Exception {
        try {
            MimeMultipart multiPart = new MimeMultipart(
                    new ByteArrayDataSource(is, MULTI_PART_MIME_TYPE));
            int count = multiPart.getCount();
            for (int part = 0; part < count; part++) {
                BodyPart body = multiPart.getBodyPart(part);
                if (body.isMimeType(OUTPUT_MIME_TYPE)) {
                    this.inputStream = body.getInputStream();
                    break;
                }
            }
        } catch (Exception e) {
            this.inputStream = getErrorResponseStream();
        }
    }

    /**
     * Returns the input stream for a transparent image if there is an error.
     * 
     * @return The input stream.
     */
    private InputStream getErrorResponseStream() {
        return getClass().getResourceAsStream("/transparent.png");
    }

    @Override
    void transform() throws IOException {
        assert this.inputStream != null;

        try (InputStream stream = (InputStream) this.inputStream) {
            IOUtils.copy(stream, getOutputStream());
        } catch (Exception e) {
            IOUtils.copy(this.getErrorResponseStream(), getOutputStream());
        }
    }

    /**
     * @param serviceEndpoint
     *            The service end point.
     * @param parameterMap
     *            A map of parameters.
     * @return A url generated based on the end point and the parameters.
     * @throws MalformedURLException
     *             If something goes wrong.
     */
    public static URL generateUrl(String serviceEndpoint,
            HashMap<String, String> parameterMap) throws MalformedURLException {
        verifyParameters(parameterMap);
        List<String> params = new ArrayList<>();
        Set<String> keys = parameterMap.keySet();
        for (String key : keys) {
            params.add(key + "=" + parameterMap.get(key));
        }

        if (!serviceEndpoint.endsWith("?")) {
            serviceEndpoint += "?";
        }
        serviceEndpoint += StringUtils.join(params, "&");
        return new URL(serviceEndpoint);

    }

    /**
     * Verify some expected parameters are present, set them if not so we will
     * have a happy request.
     * 
     * @param parameterMap
     *            The parameter map.
     */
    private static void verifyParameters(HashMap<String, String> parameterMap) {
        if (!parameterMap.containsKey(PreviewCoverage.REQUEST)) {
            parameterMap.put(PreviewCoverage.REQUEST, "GetCoverage");
        }

        parameterMap.put(STORE, STORE_VALUE);
        parameterMap.put(GRIDTYPE, EXPECTED_GRIDTYPE);
        parameterMap.put(SERVICE, SERVICE_VALUE);
        parameterMap.put(FORMAT, EXPECTED_FORMAT);

        if (parameterMap.containsKey(BOUNDINGBOX)
                && parameterMap.containsKey(GRIDBASECRS)) {
            if (!parameterMap.get(BOUNDINGBOX).endsWith(
                    "," + parameterMap.get(GRIDBASECRS))) {
                String bbox = parameterMap.get(BOUNDINGBOX) + ","
                        + parameterMap.get(GRIDBASECRS);
                parameterMap.put(BOUNDINGBOX, bbox);
            }
        }

    }

}
