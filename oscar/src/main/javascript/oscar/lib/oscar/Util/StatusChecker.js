/*
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2012 CARIS <http://www.caris.com>
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
/**
 * Class: oscar.Util.StatusChecker
 * Class for checking the status of a connection.
 * 
 * @deprecated
 */
oscar.Util.StatusChecker = oscar.BaseClass( {
    idParamName : null,
    baseUrl : null,
    goodMsgTxt : null,
    badMsgTxt : null,
    goodImgUrl : null,
    badImgUrl : null,
    goodStatus : null,
    badStatus : null,

    /**
     * Constructor.
     * @param idParamName The name of the id parameter to be used when making
     *        status check requests.
     * @param baseUrl The base url for status requests.
     * @param goodMsgTxt The text element to display for a good status.
     * @param badMsgTxt The text element to display for a bad status.
     * @param goodImgUrl The url to the img to display for a good status.
     * @param badImgUrl The url to the img to display for a bad status.
     * @param goodStatus The value expected from the AJAX status request if the
     *        connection is good.
     * @param badStatus The value expected from the AJAX status request if the
     *        connection is bad.
     */
    initialize : function(idParamName, baseUrl, goodMsgTxt, badMsgTxt,
            goodImgUrl, badImgUrl, goodStatus, badStatus) {
        this.idParamName = idParamName;
        this.baseUrl = baseUrl;
        this.goodMsgTxt = goodMsgTxt;
        this.badMsgTxt = badMsgTxt;
        this.goodImgUrl = goodImgUrl;
        this.badImgUrl = badImgUrl;
        this.goodStatus = goodStatus;
        this.badStatus = badStatus;
    },

    /**
     * Function that returns a callback object used by the YUI asyncRequest
     * when calling checkStatus to handle displaying the returned status.
     * @param idParam The id of the connection whose status was retrieved.
     * @param statusElem The DOM element to display the status result in. 
     * @param statusChecker The StatusChecker object that made the request (need
     *        to pass in so it keeps a reference to it in a closure when the
     *        actual callback function is executed.).
     */
    callback : function(idParam, statusElem, statusChecker) {
      return {
        success : function(o) {
            var result = YAHOO.lang.JSON.parse(o.responseText);
            var status = result.Response.Results;
            var colData = "";
    
            if(status === statusChecker.goodStatus) {
                colData += '<img src="' + statusChecker.goodImgUrl + '"/>';
                colData += statusChecker.goodMsgTxt;
                statusElem.innerHTML = colData;
            } else if(status === statusChecker.badStatus) {
                colData += '<img src="' + statusChecker.badImgUrl + '"/>';
                colData += statusChecker.badMsgTxt;
                statusElem.innerHTML = colData;
            } else {
                statusElem.innerHTML = 'Invalid status returned: ' + status;
            }
        },
        failure : function(o) {}
      }
    },

    /**
     * Checks the status of the connection with the given id.
     * @param idParam The id of the object/connection whose status is being
     *        checked
     * @param statusElem The DOM element to display the status result in.
     */
    checkStatus : function(id, statusElem) {
        var url = this.baseUrl + "?" + this.idParamName + "=" + id;
        return YAHOO.util.Connect.asyncRequest("GET", url,
                this.callback(id, statusElem, this));
    },

    CLASS_NAME :"oscar.Util.StatusChecker"
});