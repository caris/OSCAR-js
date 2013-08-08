/**
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2013 CARIS <http://www.caris.com>
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

/**
 * The Response object holds the content type and the bytes returned from a proxy request.
 * @author tcoburn
 * 
 */
public class Response {

    /**
     * Stores the content type of the external source
     */
    private String contentType;
    
    private String filename;

    /**
     * Stores the bytes returned from the external source
     */
    private byte[] bytes=null;
    

    /**
     * Returns the content type
     * 
     * @return the contentType
     */
    public String getContentType() {
        return contentType;
    }

    /**
     * Sets the content type
     * 
     * @param contentType
     *            the contentType to set
     */
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    /**
     * Returns the byte array
     * 
     * @return the bytes
     */
    public byte[] getBytes() {
        return bytes.clone();
    }

    /**
     * Sets the byte array
     * 
     * @param bytes
     *            the bytes to set
     */
    public void setBytes(byte[] bytes) {
        this.bytes = bytes.clone();
    }

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

}