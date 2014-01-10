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

import static org.junit.Assert.*;

import org.easymock.EasyMock;
import org.junit.Test;

public class TestDownloadService {
    @Test
    public void testDownloadService() throws Exception {
        String testString = new String("some random words that are not so random.");
        byte[] byteResponse = testString.getBytes();
        
        DownloadService ds = EasyMock.createMock(DownloadService.class);
        EasyMock.expect(ds.run()).andReturn(byteResponse);
        EasyMock.replay(ds);
        
        byte[] b = ds.run();
        
        String stringResponse = new String(b);
        assertTrue(stringResponse.equals(testString));
    }
}
