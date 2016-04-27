<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns="http://www.caris.com/cem/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cem="http://www.caris.com/cem/1.0"
    xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:gmd="http://www.isotc211.org/2005/gmd"
    xmlns:gmi="http://www.isotc211.org/2005/gmi" xmlns:gml="http://www.opengis.net/gml/3.2"
    xmlns:gts="http://www.isotc211.org/2005/gts" xmlns:xlink="http://www.w3.org/1999/xlink">
	<xsl:output method="html"/>
    <xsl:template match="gmd:MD_Metadata">
    	<html>
    		<head>
    			<style>
    				body {
    					font-family:Verdana;
    					font-size:12px;
    				}
    			</style>
    		</head>
    		<body>
    		<xsl:apply-templates/>
    		</body>
    	</html>
    </xsl:template>
    <xsl:template match="*"/>
    <xsl:template match="gmd:fileIdentifier">
    	File Identifier: <xsl:value-of select="."></xsl:value-of>
    </xsl:template>
</xsl:stylesheet>
