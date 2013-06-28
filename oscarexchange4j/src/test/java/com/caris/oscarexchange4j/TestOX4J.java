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
package com.caris.oscarexchange4j;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;

import com.caris.oscarexchange4j.theme.Cover;
import com.caris.oscarexchange4j.theme.DataLayer;
import com.caris.oscarexchange4j.theme.Theme;
import com.caris.oscarexchange4j.theme.ThemeLayer;
import com.caris.oscarexchange4j.theme.services.CatalogueService;
import com.caris.oscarexchange4j.theme.services.ServiceEntry;
import com.caris.oscarexchange4j.theme.services.Services;

import junit.framework.TestCase;

/**
 * @author tcoburn
 * 
 */
public class TestOX4J extends TestCase {

    public void testToJson() {
        OX4J oxf = new OX4J();
        List<Theme> list = new ArrayList<Theme>();
        Theme theme = new Theme();
        theme.setName("Default");
        theme.setCovers(createThemeCovers());
        theme.setLayers(createThemeLayers());
        theme.addParameter("NumZoomLevels", "5");
        theme.setServices(getService());
        list.add(theme);
        oxf.setThemes(list);
        oxf.setPrettyPrinting(true);
        System.out.println(oxf.toJson());
        assertTrue(oxf.getThemes().size() == 1);
    }

    private Services getService() {
        Services services = new Services();
        CatalogueService service = new CatalogueService();
        ServiceEntry serviceEntry = new ServiceEntry();
        serviceEntry
                .setUrl("http://tcoburnws.caris.priv:8080/sfs/services/ows/csw");
        serviceEntry.addAttribute("outputSchema",
                "http://www.isotc211.org/2005/gmd");
        service.addServiceEntry(serviceEntry);
        services.addService(service);

        return services;
    }

    private Set<Cover> createThemeCovers() {
        HashSet<Cover> set = new HashSet<Cover>();
        Cover c = new Cover();
        set.add(c);
        return set;
    }

    private ArrayList<ThemeLayer> createThemeLayers() {
        ArrayList<ThemeLayer> set = new ArrayList<ThemeLayer>();
        ThemeLayer l = new ThemeLayer();
        l.setName("Archie");
        l.addUrl("http://archie.caris.priv:8080/adklfjakljflasdfljasdf?");
        l.addUrl("http://archie2.caris.priv:8080/adklfjakljflasdfljasdf?");
        ArrayList<DataLayer> dLayers = new ArrayList<DataLayer>();
        DataLayer dl = new DataLayer();
        dl.setLayerName("test");
        dLayers.add(dl);
        dl = new DataLayer();
        dl.setLayerName("test2");
        dLayers.add(dl);
        l.setDataLayers(dLayers);
        set.add(l);
        l = new ThemeLayer();
        l.setName("Demis");
        l.addUrl("http://demis");
        set.add(l);
        return set;
    }

}
