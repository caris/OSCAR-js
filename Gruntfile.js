/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
	srcPath:"src/lib",
	dstPath:"public/",
    // Task configuration.
	bowercopy : {
		jqueryui: {
			options: {
				srcPrefix:"bower_components/jqueryui/",
				destPrefix:"<%= dstPath %>/jqueryui"
			},
			files:{
				'jquery-ui.min.js':'jquery-ui.min.js',
				'../jquery/dist/jquery.min.js':'../jquery/dist/jquery.min.js'
			}
		},
		jqueryUILayout: {
			options: {
				srcPrefix:"bower_components/jqueryUILayout/source/stable",
				destPrefix:"<%= dstPath %>/jqueryui-layout"
			},
			files:{
				'jquery.layout.min.js':'jquery.layout.min.js'
			}
		},
		openlayers2: {
			options: {
				srcPrefix:"bower_components/openlayers2",
				destPrefix:"<%= dstPath %>/openlayers"
			},
			files:{
				'OpenLayers.js':'OpenLayers.js',
				'img':'img',
				'theme':'theme'
			}
		},
		slimscroll: {
			options: {
				srcPrefix:"bower_components/slimscroll",
				destPrefix:"<%= dstPath %>/slimscroll"
			},
			files:{
				'jquery.slimscroll.js':'jquery.slimscroll.js',
			}
		},
		jsts: {
			options: {
				srcPrefix:"bower_components/jsts/src",
				destPrefix:"<%= dstPath %>/jsts"
			},
			files:{
				'jsts.js':'jsts.js'
			}
		},
		yui2: {
			options: {
				srcPrefix:"bower_components/yui2",
				destPrefix:"<%= dstPath %>/yui2"
			},
			files:{
				'build':'build'
			}
		}
	},
    concat: {
      dist: {
        src: [
			'<%= srcPath %>/oscar.js',
			'<%= srcPath %>/Util.js',
			'<%= srcPath %>/Types/BaseClass.js',
			'<%= srcPath %>/ox/ox.js',
			'<%= srcPath %>/Gui.js',
			'<%= srcPath %>/Gui/CatalogueResults.js',
			'<%= srcPath %>/Gui/Download.js',
			'<%= srcPath %>/Gui/Download/WCS.js',
			'<%= srcPath %>/Gui/Download/WFS.js',
			'<%= srcPath %>/Gui/CollapsiblePanel.js',
			'<%= srcPath %>/Gui/DownloadOptions.js',
			'<%= srcPath %>/Gui/ServicePanel.js',
			'<%= srcPath %>/Gui/ClickableLabel.js',
			'<%= srcPath %>/Gui/ComboBox.js',
			'<%= srcPath %>/Gui/LinkedLists.js',
			'<%= srcPath %>/Gui/Wizards.js',
			'<%= srcPath %>/Handler.js',
			'<%= srcPath %>/Handler/CSW.js',
			'<%= srcPath %>/Handler/WFS.js',
			'<%= srcPath %>/Control.js',
			'<%= srcPath %>/Control/ArgParser.js',
			'<%= srcPath %>/Control/DragPanel.js',
			'<%= srcPath %>/Control/DataDiscovery.js',
			'<%= srcPath %>/Control/Multi.js',
			'<%= srcPath %>/Control/MeasurementTools.js',
			'<%= srcPath %>/Control/SelectionTools.js',
			'<%= srcPath %>/Control/PanZoom.js',
			'<%= srcPath %>/Control/PanZoomBar.js',
			'<%= srcPath %>/Control/ToolBar.js',
			'<%= srcPath %>/Control/Box.js',
			'<%= srcPath %>/Control/RangeSelect.js',
			'<%= srcPath %>/Control/Point.js',
			'<%= srcPath %>/Control/Select.js',
			'<%= srcPath %>/Control/CatalogueSearchForm.js',
			'<%= srcPath %>/Control/Print.js',
			'<%= srcPath %>/Control/DataExtractor.js',
			'<%= srcPath %>/Control/Measure.js',
			'<%= srcPath %>/Control/MetaData.js',
			'<%= srcPath %>/Control/PreviousView.js',
			'<%= srcPath %>/Control/OverviewMap.js',
			'<%= srcPath %>/Control/SelectFeature.js',
			'<%= srcPath %>/Control/ThemeManager.js',
			'<%= srcPath %>/Control/OXFConfigManager.js',
			'<%= srcPath %>/Control/ThemeSwitcher.js',
			'<%= srcPath %>/Format.js',
			'<%= srcPath %>/Format/OGC.js',
			'<%= srcPath %>/Format/OGC/ows.js',
			'<%= srcPath %>/Format/OGC/wcs.js',
			'<%= srcPath %>/Format/OGC/wfs.js',
			'<%= srcPath %>/Format/OGC/wmts.js',
			'<%= srcPath %>/Format/OXF.js',
			'<%= srcPath %>/Format/OXF/v2.js',
			'<%= srcPath %>/Format/OXF/XML.js',
			'<%= srcPath %>/Format/WCSCapabilities.js',
			'<%= srcPath %>/Format/WCSCapabilities/v1.js',
			'<%= srcPath %>/Format/WCSCapabilities/v1_0_0.js',
			'<%= srcPath %>/Format/WCSCapabilities/v1_1_0.js',
			'<%= srcPath %>/Format/WCSCapabilities/v1_1_1.js',
			'<%= srcPath %>/Format/WCSCapabilities/v1_1_2.js',
			'<%= srcPath %>/Format/WCSDescribeCoverage.js',
			'<%= srcPath %>/Format/WCSDescribeCoverage/v1.js',
			'<%= srcPath %>/Format/WCSDescribeCoverage/v1_0_0.js',
			'<%= srcPath %>/Format/WCSDescribeCoverage/v1_1_0.js',
			'<%= srcPath %>/Format/WCSDescribeCoverage/v1_1_1.js',
			'<%= srcPath %>/Format/WCSDescribeCoverage/v1_1_2.js',
			'<%= srcPath %>/Format/WMTSCapabilities.js',
			'<%= srcPath %>/Format/WMTSCapabilities/v1.js',
			'<%= srcPath %>/Format/WMTSCapabilities/v1_0_0.js',
			'<%= srcPath %>/Format/WFSDescribeFeatureType.js',
			'<%= srcPath %>/Format/WFSDescribeFeatureType/v1.js',
			'<%= srcPath %>/Format/WFSDescribeFeatureType/v1_0_0.js',
			'<%= srcPath %>/Format/WFSDescribeFeatureType/v1_1_0.js',
			'<%= srcPath %>/Util/ConfigManager.js',
			'<%= srcPath %>/Util/ConfirmBox.js',
			'<%= srcPath %>/Util/AlertBox.js',
			'<%= srcPath %>/Util/SelectControl.js',
			'<%= srcPath %>/Util/Database.js',
			'<%= srcPath %>/Util/Metadata.js',
			'<%= srcPath %>/Util/CoordinateReferences.js',
			'<%= srcPath %>/Util/Transform.js',
			'<%= srcPath %>/Util/Help.js',
			'<%= srcPath %>/Util/PluginManager.js',
			'<%= srcPath %>/Util/Plugin/Plugin.js',
			'<%= srcPath %>/Util/Plugin/Download/Download.js',
			'<%= srcPath %>/Util/Plugin/Download/WCSService.js',
			'<%= srcPath %>/Lang.js',
			'<%= srcPath %>/Lang/en.js',
			'<%= srcPath %>/Lang/es.js',
			'<%= srcPath %>/Lang/fr.js',
			'<%= srcPath %>/Popup/FramedCloud.js',
			'<%= srcPath %>/Map.js',
			'<%= srcPath %>/OLPrototypePatches.js',
			'<%= srcPath %>/Gui/Dialog.js',
			'<%= srcPath %>/Gui/AlertDialog.js',
			'<%= srcPath %>/Gui/ConfirmDialog.js',
			'<%= srcPath %>/Gui/MultiItemChooserTable.js',
			'<%= srcPath %>/Gui/MultiCoordinateSystemsChooser.js',
			'<%= srcPath %>/Gui/MultiDataExtractionChooser.js',
			'<%= srcPath %>/Gui/Grid.js',
			'<%= srcPath %>/Gui/Metadata.js',
			'<%= srcPath %>/Gui/KeywordVocabularyTable.js',
			'<%= srcPath %>/Control/Permalink.js',
			'<%= srcPath %>/Util/SettingsAutoCompleteTable.js',
			'<%= srcPath %>/Util/SFSAutoCompleteTable.js',
			'<%= srcPath %>/Util/StatusChecker.js',
			'<%= srcPath %>/Util/DivSelect.js',
			'<%= srcPath %>/Util/DivSelectOption.js',
			'<%= srcPath %>/Util/CoordinateSystemAutoComplete.js',
		],
        dest: '<%= dstPath %>/oscar/oscar.js'
      }
    },
	uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/oscar.min.js'
      }
    },
	copy: {
		main: {
			expand : true,
            dest   : '<%= dstPath %>/oscar',
            cwd    : 'src/',
            src    : [
              'help/**',
			  'images/**',
			  'resources/**',
			  'test/**',
			  'theme/**',
			  'Loader.js'
            ]
		}
	},
	compress:{
		main: {
		
		options: {
		  archive: function () {
			// The global value git.tag is set by another task
			return 'oscar.zip'
		  }
		},
		files: [
			{
                src: ['**'],
                dest: '',
                cwd: 'public/',
                expand: true
            }
		]
	  }
	}
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');


  // Default task.
  grunt.registerTask('default', ['concat','uglify','bowercopy','copy','compress']);

};
