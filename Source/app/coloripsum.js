app.service('coloripsum', function() {
    
	var self = this;
	
	var paletteTemplate = function () {
		return {
			main : '',
			complementary : '',
			dark : '',
			light : '',
			noHash : {
				main : '',
				complementary : '',
				dark : '',
				light : ''
			},
			luminocity : {
				main : '',
				complementary : '',
				dark : '',
				light : ''
			},
			uiColors : {
				background : '',
				hex : '',
				texts : ''
			}
		};
	};
	
	this.random = function() {
		var mainHex  = randomHex();
		var darkHex  = randomShades(true);
		var lightHex = randomShades(false);
	
		var palette = self.palette({
			mainHex : mainHex,
			darkHex : darkHex,
			lightHex : lightHex
		});
		
		return palette;
	};
	
	this.palette = function(options) {
		var defaults = {
			mainHex : '#FFFFFF',
			darkHex : '#424242',
			lightHex : '#FAFAFA'
		}
        
		var opts    = extend(defaults, options);
		var palette = new paletteTemplate();
		
		palette.main            = opts.mainHex;
		palette.noHash.main     = cutHex(palette.main).toUpperCase();
		palette.luminocity.main = hexLuminocity(palette.main);
		
		palette.complementary            = findComplementary(opts.mainHex);
		palette.noHash.complementary     = cutHex(palette.complementary).toUpperCase();
		palette.luminocity.complementary = hexLuminocity(palette.complementary);
		
		palette.dark            = hexBlendOverlay(opts.mainHex, 0.2, opts.darkHex);
		palette.noHash.dark     = cutHex(palette.dark).toUpperCase();
		palette.luminocity.dark = hexLuminocity(palette.dark);
		
		palette.light            = hexBlendOverlay(opts.mainHex, 0.2, opts.lightHex);
		palette.noHash.light     = cutHex(palette.light).toUpperCase();
		palette.luminocity.light = hexLuminocity(palette.light);

		palette.uiColors = extend(palette.uiColors, generateUIColors(palette.main));
		
		return palette;
	};
	
	this.generatePaletteFromURL = function(options) {
		var palette = extend(new paletteTemplate(), options);
		
		palette.luminocity.main          = hexLuminocity(palette.main);
		palette.luminocity.complementary = hexLuminocity(palette.complementary);
		palette.luminocity.dark          = hexLuminocity(palette.dark);
		palette.luminocity.light         = hexLuminocity(palette.light);

		palette.uiColors = extend(palette.uiColors, generateUIColors(palette.main));
		
		return palette;
	};
	
	this.hexToRGBA = function(hex, alpha) {
		return hexToRGBA(hex, alpha);
	};
	
	this.rgbaToHex = function(rgba, baseRGB) {
		return rgbaToHex(rgba, baseRGB);
	};
	
	this.hexOpacity = function(hex, alpha, baseHex) {
		return hexOpacity(hex, alpha, baseHex);
	};
	
	this.hexBlendOverlay = function(hex, alpha, baseHex) {
		return hexBlendOverlay(hex, alpha, baseHex);
	};
	
	this.hexLuminocity = function(hex) {
		return hexLuminocity(hex);
	};
	
	/**
	 * Find complementary color 
	 * 
	 * @param   {str} hex The hex color string
	 *                    
	 * @returns {str}   The complementary color hex string
	 */
	function findComplementary(hex) {
		var hex           = hexStringTohex(hex);
		var complementary = (000000 + ((0xffffff - hex).toString(16))).slice(-6);
        
		while (complementary.length < 6) {
			complementary = '0' + complementary;
		}
		
		return '#' + complementary;
	}
	
	/**
	 * Recreates blend mode multiply and returns hex color string
	 * 
	 * @param   {obj}   baseRGB   Object that contains the RGB values of the base color
	 * @param   {obj}   colorRGBA Object that contains the RGBA values of the blended color
	 *                               
	 * @returns {str} The hex color string of the resulting color
	 */
	function blendMultiply(baseRGB, colorRGBA) {
		var blend = {};
	  
		blend.r = Math.round((2 * baseRGB.r * colorRGBA.r) / 255);
		blend.g = Math.round((2 * baseRGB.g * colorRGBA.g) / 255);
		blend.b = Math.round((2 * baseRGB.b * colorRGBA.b) / 255);
		blend.a = colorRGBA.a;
	  
		return rgbaToHex(blend, baseRGB);
	}
	
	/**
	 * Recreates blend mode screen and returns hex color string
	 * 
	 * @param   {obj}   baseRGB   Object that contains the RGB values of the base color
	 * @param   {obj}   colorRGBA Object that contains the RGBA values of the blended color
	 *                               
	 * @returns {str} The hex color string of the resulting color
	 */
	function blendScreen(baseRGB, colorRGBA) {
		var blend = {};
	  
		blend.r = Math.round((1 - ((1 - (baseRGB.r/255)) * (1 - (2 * colorRGBA.r/255 - 1)))) * 255);
		blend.g = Math.round((1 - ((1 - (baseRGB.g/255)) * (1 - (2 * colorRGBA.g/255 - 1)))) * 255);
		blend.b = Math.round((1 - ((1 - (baseRGB.b/255)) * (1 - (2 * colorRGBA.b/255 - 1)))) * 255);
		blend.a = colorRGBA.a;
	  
		return rgbaToHex(blend, baseRGB);
	}
	
	/**
     * Recreates blend mode overlay and returns hex color string
	 * 
	 * @param   {obj} baseRGB   Object that contains the RGB values of the base color
	 * @param   {obj} colorRGBA Object that contains the RGBA values of the blended color
	 *                        
	 * @returns {str} The hex color string of the resulting color
	 */
	function blendOverlay(baseRGB, colorRGBA) {
		var lumen = rgbLuminocity(baseRGB);
		var blend = '';
        
        // Blend mode overlay is multiply for dark colors and screen for light ones
		if (lumen <= 0.5) {
			blend = blendMultiply(baseRGB, colorRGBA);
		} else {
			blend = blendScreen(baseRGB, colorRGBA);
		}
	  
		return blend;
	}
	
	/**
	 * Calculates the luminocity of a color
	 * 
	 * @param   {obj}   rgb Object that contains the RGB values of the color
	 *                      
	 * @returns {num} The luminocity of a color (0-1)
	 */
	function rgbLuminocity(rgb) {
		return ((rgb.r + rgb.g + rgb.b)/3)/255;
	}
	
	/**
	 * Converts an RGBA color to hex string getting into consideration the base color
	 * Reproduces in hex the same visual result as an RGBA color above another base color
	 * 
	 * @param   {obj}   rgba    Object that contains the RGBA values of the color
	 * @param   {obj}   baseRGB Object that contains the RGB values of the base color
	 *                             
	 * @returns {str} The hex color string of the resulting color
	 */
	function rgbaToHex(rgba, baseRGB) {
		var rgb = {};
		
		rgb.r = (1 - rgba.a) * baseRGB.r + rgba.a * rgba.r;
		rgb.g = (1 - rgba.a) * baseRGB.g + rgba.a * rgba.g;
		rgb.b = (1 - rgba.a) * baseRGB.b + rgba.a * rgba.b;
		
		return rgbToHex(rgb.r, rgb.g, rgb.b);
	}
	
	/**
	 * Converts hex color to RGBA
	 * 
	 * @param   {str} hex   The hex color string
	 * @param   {num} alpha The desired Alpha channel value (must be 0-1)
	 *                           
	 * @returns {obj} An object containing the RGBA values of the color
	 */
	function hexToRGBA(hex, alpha) {
		var rgba = {
			r: hexToR(hex),
			g: hexToG(hex),
			b: hexToB(hex),
			a: alpha
		};
		
		return rgba;
	}
	
	/**
	 * Retrieves the R channel value from a hex color string
	 * 
	 * @param   {str} hex The hex color string
	 *                    
	 * @returns {int} The R channel value of the color
	 */
	function hexToR(hex) {
		return parseInt((cutHex(hex)).substring(0,2),16);
	}
	
    /**
	 * Retrieves the G channel value from a hex color string
	 * 
	 * @param   {str} hex The hex color string
	 *                    
	 * @returns {int} The G channel value of the color
	 */
	function hexToG(hex) {
		return parseInt((cutHex(hex)).substring(2,4),16);
	}
	
    /**
	 * Retrieves the B channel value from a hex color string
	 * 
	 * @param   {str} hex The hex color string
	 *                    
	 * @returns {int} The B channel value of the color
	 */
	function hexToB(hex) {
		return parseInt((cutHex(hex)).substring(4,6),16);
	}
	
	/**
	 * Returns a hex color string without the '#' character (if it exists)
	 * 
	 * @param   {str}   hex The hex color string
	 *                      
	 * @returns {str} The hex color string without the '#' character
	 */
	function cutHex(hex) {
		return (hex.charAt(0)=="#") ? hex.substring(1,7):hex;
	}
	
	/**
	 * Converts hex color string to hex number
	 * 
	 * @param   {str}   hexString The hex color string
	 *                            
	 * @returns {int} The hex color
	 */
	function hexStringTohex(hexString) {
		return parseInt(hexString.replace(/^#/, ''), 16);
	}
	
	/**
	 * Converts RGB channels to hex color string
	 * 
	 * @param   {int} R The R channel
	 * @param   {int} G The G channel
	 * @param   {int} B The B channel
	 *                  
	 * @returns {str}   The hex color string
	 */
	function rgbToHex(R,G,B) {
		return '#' + toHex(R) + toHex(G) + toHex(B);
	}
	
	/**
	 * Converts a number to hex
	 * 
	 * @param   {int} n The number
	 *                  
	 * @returns {str}   The hex code
	 */
	function toHex(n) {
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16)
			+ "0123456789ABCDEF".charAt(n%16);
	}
	
	function randomHex() {
		var random = '';
        
		while (random.length < 6) {
			random += (Math.random()).toString(16).substr(-6).substr(-1);
		}
        
		return '#' + random;
	}
	
	/**
	 * Generates a random shade (dark or light) of a predefined color
	 * 
	 * @param   {boo} dark Boolean value for setting dark or light color
	 *                     
	 * @returns {str}   The hex color string of the resulting shade
	 */
	function randomShades(dark) {
		var percent = Math.random();
		var color   = '#EEEEEE'
        
		if (dark) {
			color   = '#777777';
			percent = - percent;
		}
		
		var f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        
		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}
	
	/**
	 * Generates a hex color that emulates the visual result of a color (with opacity) over another
	 * 
	 * @param   {str} hex     The hex color string of the color
	 * @param   {int} alpha   The Alpha channel value we desire
	 * @param   {str} baseHex The hex color string of the base color
	 *                        
	 * @returns {str} The hex color string of the resulting color
	 */
	function hexOpacity(hex, alpha, baseHex) {
		var rgba     = hexToRGBA(hex, alpha);
		var baseRGBA = hexToRGBA(baseHex, 1);
		
		return rgbaToHex(rgba, baseRGBA);
	}
	
	/**
	 * Generates a hex color that emulates the visual result of overlay blend mode
	 * 
	 * @param   {str} hex     The hex color string of the color
	 * @param   {int} alpha   The Alpha channel value we desire
	 * @param   {str} baseHex The hex color string of the base color
	 *                        
	 * @returns {str} The hex color string of the resulting color
	 */
	function hexBlendOverlay(hex, alpha, baseHex) {
		var rgba     = hexToRGBA(hex, alpha);
		var baseRGBA = hexToRGBA(baseHex, 1);
		
		return blendOverlay(baseRGBA, rgba);
	}
	
    /**
	 * Calculates the luminocity of a hex color string
	 * 
	 * @param   {str} hex     The hex color string 
	 *                        
	 * @returns {int} The luminocity of the color
	 */
	function hexLuminocity(hex) {
		var rgb = hexToRGBA(hex, 1);
		
		return rgbLuminocity(rgb);
	}
	
	/**
	 * Generates the colors for the UI
	 * 
	 * @param   {str} hex The hex color string of the base color
	 *                    
	 * @returns {obj} Object containing the different UI colors
	 */
	function generateUIColors(hex) {
		var UIColors        = {};
		UIColors.background = hexOpacity(hex, 0.1, '#FFFFFF');
		UIColors.hex        = hexOpacity(hex, 0.6, UIColors.background);
		
		if (hexLuminocity(UIColors.background) > 0.85 && hexLuminocity(UIColors.hex) > 0.85) {
			UIColors.hex = hexOpacity(UIColors.hex, 0.9, '#424242');
		}
		
		UIColors.texts = hexBlendOverlay(hex, 0.2, '#424242');
		
		return UIColors;
	}
	
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	
});
