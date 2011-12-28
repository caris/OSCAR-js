<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:ows="http://www.opengis.net/ows" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:owcs="http://www.opengis.net/wcs/1.1/ows" xmlns:geonet="http://www.fao.org/geonetwork" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dct="http://purl.org/dc/terms/">

<xsl:template match="owcs:Coverages"  xmlns:geonet="http://www.fao.org/geonetwork" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dct="http://purl.org/dc/terms/">
    
    <xsl:apply-templates/>
    
</xsl:template>
<xsl:template match="owcs:Coverage">
    <xsl:apply-templates/>
</xsl:template>
<xsl:template match="owcs:Identifier">
</xsl:template>
<xsl:template match="owcs:Reference">
    <xsl:variable name="role">
        <xsl:choose>
            <xsl:when test="(contains(@xlink:role,'coverage'))">dCoverage</xsl:when>
            <xsl:otherwise>dMetadata</xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:element name="span">
        <xsl:attribute name="class"><xsl:value-of select="$role"/></xsl:attribute>
        <xsl:attribute name="href"><xsl:value-of select="@xlink:href"/></xsl:attribute>
        <xsl:text/>
    </xsl:element>
</xsl:template>
</xsl:stylesheet>