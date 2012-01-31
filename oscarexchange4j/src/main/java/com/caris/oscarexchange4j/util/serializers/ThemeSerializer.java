/**
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2011 CARIS <http://www.caris.com>
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

package com.caris.oscarexchange4j.util.serializers;

/*
 * WEB-999 - Custom serializer for Gson and Themes.
 */
import java.lang.reflect.Method;
import java.lang.reflect.Type;

import org.apache.log4j.Logger;

import com.caris.oscarexchange4j.theme.Theme;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

/**
 * @author tcoburn
 * 
 */
public class ThemeSerializer implements JsonSerializer<Theme> {
    Logger logger = Logger.getLogger(this.getClass().getName());
    /*
     * (non-Javadoc)
     * 
     * @see com.google.gson.JsonSerializer#serialize(java.lang.Object,
     * java.lang.reflect.Type, com.google.gson.JsonSerializationContext)
     */
    @Override
    public JsonElement serialize(Theme src, Type typeOfSrc,
            JsonSerializationContext context) {
        JsonObject obj = new JsonObject();
        obj.add("id", context.serialize(src.getId()));
        if (src.getName() != null)
            obj.add("name", context.serialize(src.getName()));
        if (src.getCovers() != null)
            obj.add("covers", context.serialize(src.getCovers()));
        if (src.getLayers() != null)
            obj.add("layers", context.serialize(src.getLayers()));
        obj.add("displayOrder", context.serialize(src.getDisplayOrder()));
        if (src.getSRS() != null)
            obj.add("srs", context.serialize(src.getSRS()));
        if (src.getBackgroundColor() != null)
            obj.add("backgroundColor", context.serialize(src.getBackgroundColor()));
        if(src.getServices()!=null)
        	obj.add("services", context.serialize(src.getServices()));
        try {
            Method method = Theme.class.getMethod("getParameters", (Class<?>[])null);
            Type returnType = method.getGenericReturnType();
            obj.add("parameters",context.serialize(src.getParameters(),returnType));
        } catch (SecurityException e) {
            logger.error(e.getMessage(),e);
        } catch (NoSuchMethodException e) {
            logger.error(e.getMessage(),e);
        }
        return obj;
    }
}
