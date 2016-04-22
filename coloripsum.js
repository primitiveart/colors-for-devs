var coloripsum = function(options){
	
	var ci = this;
	
	var defaults = {};
	
	var opts = extend(defaults, options);
	
	var paletteTemplate = function (){
		return {
			main : '',
			complementary : '',
			texts : '',
			background : '',
			noHash : {
				main : '',
				complementary : '',
				texts : '',
				background : ''
			}
		}
	}
	
	this.random = function(){
		var mainHex = randomHex();
		var textsHex = randomShades(true);
		var backgroundHex = randomShades(false);
	
		var palette = ci.palette({
			mainHex : mainHex,
			textsHex : textsHex,
			backgroundHex : backgroundHex
		});
		
		return palette;
	}
	
	this.palette = function(options){
		var defaults = {
			mainHex : '#FFFFFF',
			textsHex : '#424242',
			backgroundHex : '#FAFAFA'
		}
		var opts = extend(defaults, options);
		
		var palette = new paletteTemplate();
		
		palette.main = opts.mainHex;
		palette.noHash.main = cutHex(palette.main);
		
		palette.complementary = findComplementary(opts.mainHex);
		palette.noHash.complementary = cutHex(palette.complementary);
		
		var colorRGB = hexToRGBA(opts.mainHex, 0.2);
		
		var textsRGB = 	hexToRGBA(opts.textsHex, 1);
		palette.texts = blendOverlay(textsRGB, colorRGB);
		palette.noHash.texts = cutHex(palette.texts);
		
		var backgroundRGB = hexToRGBA(opts.backgroundHex, 1);
		palette.background = blendOverlay(backgroundRGB, colorRGB);
		palette.noHash.background = cutHex(palette.background);		
		
		return palette;
	}
	
	this.hexToRGBA = function(hex, alpha){
		return hexToRGBA(hex, alpha);
	}
	
	this.rgbaToHex = function(rgba, baseRGB){
		return rgbaToHex(rgba, baseRGB);
	}
	
	this.hexOpacity = function(hex, alpha, baseHex){
		return hexOpacity(hex, alpha, baseHex);
	}
	
	this.hexBlendOverlay = function(hex, alpha, baseHex){
		return hexBlendOverlay(hex, alpha, baseHex);
	}
	
	function findComplementary(mainHex){
		var hex = hexStringTohex(mainHex);
		var complementary = (000000 + ((0xffffff - hex).toString(16))).slice(-6);
		while(complementary.length < 6){
			complementary = '0' + complementary;
		}
		
		return '#' + complementary;
	}
	
	function blendMultiply(baseRGB, colorRGB){
		var blend = {};
	  
		blend.r = Math.round((2 * baseRGB.r * colorRGB.r) / 255);
		blend.g = Math.round((2 * baseRGB.g * colorRGB.g) / 255);
		blend.b = Math.round((2 * baseRGB.b * colorRGB.b) / 255);
		blend.a = colorRGB.a;
	  
		return rgbaToHex(blend, baseRGB);
	}
	
	function blendScreen(baseRGB, colorRGB){
		var blend = {};
	  
		blend.r = Math.round((1 - ((1 - (baseRGB.r/255)) * (1 - (2 * colorRGB.r/255 - 1)))) * 255);
		blend.g = Math.round((1 - ((1 - (baseRGB.g/255)) * (1 - (2 * colorRGB.g/255 - 1)))) * 255);
		blend.b = Math.round((1 - ((1 - (baseRGB.b/255)) * (1 - (2 * colorRGB.b/255 - 1)))) * 255);
		blend.a = colorRGB.a;
	  
		return rgbaToHex(blend, baseRGB);
	}
	
	function blendOverlay(baseRGB, colorRGB){
		var lumen = rgbLuminocity(baseRGB);
		var blend = '';
	  
		if(lumen <= 0.5){
			blend = blendMultiply(baseRGB, colorRGB);
		}
		else {
			blend = blendScreen(baseRGB, colorRGB);
		}
	  
		return blend;
	}
	
	function rgbLuminocity(rgb){
		return ((rgb.r + rgb.g + rgb.b)/3)/255;
	}
	
	function rgbaToHex(rgba, baseRGB){
		var rgb = {};
		
		rgb.r = (1 - rgba.a) * baseRGB.r + rgba.a * rgba.r;
		rgb.g = (1 - rgba.a) * baseRGB.g + rgba.a * rgba.g;
		rgb.b = (1 - rgba.a) * baseRGB.b + rgba.a * rgba.b;
		
		return rgbToHex(rgb.r, rgb.g, rgb.b);
	}
	
	function hexToRGBA(hex, alpha){
		var rgb = {
			r: hexToR(hex),
			g: hexToG(hex),
			b: hexToB(hex),
			a: alpha
		}
		
		return rgb;
	}
	
	function hexToR(hex){
		return parseInt((cutHex(hex)).substring(0,2),16);
	}
	
	function hexToG(hex){
		return parseInt((cutHex(hex)).substring(2,4),16);
	}
	
	function hexToB(hex){
		return parseInt((cutHex(hex)).substring(4,6),16);
	}
	
	function cutHex(hex){
		return (hex.charAt(0)=="#") ? hex.substring(1,7):hex;
	}
	
	function hexStringTohex(hexString){
		return parseInt(hexString.replace(/^#/, ''), 16);
	}
	
	function rgbToHex(R,G,B){
		return '#' + toHex(R) + toHex(G) + toHex(B);
	}
	
	function toHex(n){
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16)
			+ "0123456789ABCDEF".charAt(n%16);
	}
	
	function randomHex(){
		var random = '';
		while (random.length < 6) {
			random += (Math.random()).toString(16).substr(-6).substr(-1);
		}
		return '#'+random;
	}
	
	function randomShades(dark){
		var percent = Math.random();
		var color = '#EEEEEE'
		if(dark){
			color = '#777777';
			percent = - percent;
		}
		
		var f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}
	
	function hexOpacity(hex, alpha, baseHex){
		var rgba = hexToRGBA(hex, alpha);
		var baseRGB = hexToRGBA(baseHex, 1);
		
		return rgbaToHex(rgba, baseRGB);
	}
	
	function hexBlendOverlay(hex, alpha, baseHex){
		var rgba = hexToRGBA(hex, alpha);
		var baseRGB = hexToRGBA(baseHex, 1);
		
		return blendOverlay(baseRGB, rgba);
	}
	
	function extend(a, b){
		for(var key in b){
			if(b.hasOwnProperty(key)){
				a[key] = b[key];
			}
		}
		return a;
	}

	return this;
	
};