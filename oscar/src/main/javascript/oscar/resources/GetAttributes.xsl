<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<xsl:output method="html"/>
<xsl:template match="Attributes">
	<style>
	table.getAttributes-table {
		border:1px solid black;
		padding:5px;
		border-spacing:3px;
		border-padding:5px;
		
	}
	th.getAttributes-header {
		color:#fff;
		background-color:#09c;
		white-space: nowrap;
		text-align:left;
		font-weight:bold;
		border:1px solid black;
		padding:5px;
	}
	td.getAttributes-data {
		color:#fff;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		cursor:pointer;
		border:1px solid black;
		padding:5px;
	}	
	 
	</style>
	<xsl:choose>
	<xsl:when test="count(*) &gt; 0">
	<table class="getAttributes-table">
	<tr>
	<xsl:for-each select="Attribute">
		<th class="getAttributes-header"><xsl:value-of select="@name"/></th>
	</xsl:for-each>
	</tr>
	<tr>
	<xsl:for-each select="Attribute">
		<td class="getAttributes-data"><xsl:value-of select="."/></td>
	</xsl:for-each>
	</tr>
	</table>
	</xsl:when>
	<xsl:otherwise>
		opps
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>
<xsl:template match="ows:ExceptionReport">
	<div><xsl:apply-templates/></div>
</xsl:template>
<xsl:template match="ows:ExceptionText">
	<div class="iamerror"><xsl:value-of select="."/></div>
</xsl:template>
</xsl:stylesheet>
