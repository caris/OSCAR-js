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
(function() {
    oscar._imgPath = null;
    oscar._scriptName=null;
    oscar._getScriptLocation = function() {
        return this._scriptLocation;
    };
    oscar.getImagePath=function() {
     return oscar._getScriptLocation() + "images/";
    }	
    oscar.jQuery = jQuery.noConflict();
    window.$$ = oscar.jQuery;
    oscar.DownloadHost=null;
})();
/**
 * Constant: VERSION_NUMBER
 */
oscar.VERSION_NUMBER = "14.0-SNAPSHOT";
