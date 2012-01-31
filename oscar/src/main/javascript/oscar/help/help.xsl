<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/"></xsl:template>
<xsl:template match="component">
    <xsl:apply-templates/>
</xsl:template>
<xsl:template match="header">
    <h3><xsl:value-of select="."/></h3>
</xsl:template>
<xsl:template match="para">
    <p><xsl:apply-templates/></p>
</xsl:template>
<xsl:template match="media">
    <xsl:variable name="src">
        <xsl:value-of select="@src"/>
    </xsl:variable>
    <img src="{$src}"/>
</xsl:template>

<!-- Formatting Elements -->
<xsl:template match="b">
    <b><xsl:value-of select="."/></b>
</xsl:template>
<xsl:template match="i">
    <i><xsl:value-of select="."/></i>
</xsl:template>
<xsl:template match="u">
    <u><xsl:value-of select="."/></u>
</xsl:template>
</xsl:stylesheet>
