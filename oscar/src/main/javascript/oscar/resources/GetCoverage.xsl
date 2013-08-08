<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!-- WCS 1.1.0 -->
<xsl:template match="owcs:Coverages"  xmlns:geonet="http://www.fao.org/geonetwork" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dct="http://purl.org/dc/terms/" xmlns:owcs="http://www.opengis.net/wcs/1.1/ows">
    <div><xsl:apply-templates/></div>
</xsl:template>
<xsl:template match="owcs:Coverage" xmlns:owcs="http://www.opengis.net/wcs/1.1/ows" xmlns:xlink="http://www.w3.org/1999/xlink">
	<xsl:apply-templates/>
</xsl:template>
<xsl:template match="owcs:Identifier"  xmlns:owcs="http://www.opengis.net/wcs/1.1/ows">
</xsl:template>
<xsl:template match="owcs:Reference"  xmlns:owcs="http://www.opengis.net/wcs/1.1/ows" xmlns:xlink="http://www.w3.org/1999/xlink">
    <xsl:variable name="role">
        <xsl:choose>
            <xsl:when test="(contains(@xlink:role,'coverage'))">dCoverage</xsl:when>
			<xsl:when test="(contains(@xlink:role,'record'))">dMetadata</xsl:when>
            <xsl:otherwise>dMetadata</xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:element name="span">
        <xsl:attribute name="class"><xsl:value-of select="$role"/></xsl:attribute>
        <xsl:attribute name="href"><xsl:value-of select="@xlink:href"/></xsl:attribute>
		<xsl:text/>
    </xsl:element>
</xsl:template>
<!-- WCS 1.1.1 -->
<xsl:template match="wcs:Coverage" xmlns:wcs="http://www.opengis.net/wcs/1.1.1">
	<xsl:apply-templates/>
</xsl:template>
<xsl:template match="wcs:Coverages" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:ows="http://www.opengis.net/ows/1.1">
	<xsl:apply-templates/>
</xsl:template>
<xsl:template match="ows:Title" xmlns:ows="http://www.opengis.net/ows/1.1"></xsl:template>
<xsl:template match="ows:Abstract" xmlns:ows="http://www.opengis.net/ows/1.1"></xsl:template>
<xsl:template match="ows:Identifier" xmlns:ows="http://www.opengis.net/ows/1.1"></xsl:template>
<xsl:template match="ows:Reference" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
    <xsl:variable name="role">
        <xsl:choose>
            <xsl:when test="(contains(@xlink:role,'coverage'))">dCoverage</xsl:when>
			<xsl:when test="(contains(@xlink:role,'record'))">dMetadata</xsl:when>
            <xsl:otherwise>dCoverage</xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:element name="span">
        <xsl:attribute name="class"><xsl:value-of select="$role"/></xsl:attribute>
        <xsl:attribute name="href"><xsl:value-of select="@xlink:href"/></xsl:attribute>
    </xsl:element>
</xsl:template>
<!-- Exception Report -->
<xsl:template match="ows:ExceptionReport" xmlns:ows="http://www.opengis.net/ows/1.1">
	error
</xsl:template>
</xsl:stylesheet>