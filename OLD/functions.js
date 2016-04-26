var cfd = new coloripsum();

$(document).ready(function(){
	
	initialize();
	
	$('.main').on('click', '.refresh > .button_fa', function(){
		var $element = $(this);
		
		$element.addClass('animate rotate');
		
		setTimeout(function(){
			$element.removeClass('animate rotate'); 
		},700);
		
		
		randomScheme();
	});
	
	$(document).on('keyup', function(e){
		if(e.keyCode == 32) {
			randomScheme();
		}
	});
	
	$('.colorsHex').on('click','.hex',function(){
		var elementClass = $(this).attr('class');
		var range, selection;
		
		var element = document.getElementsByClassName(elementClass)[0];

		if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		} else if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		}	
	});
	
	$('.main').on('click','.build-info',function(){
		var color = $('.version-color').css('backgroundColor');
		if(color.search('rgb') > -1){
			var breakColor = color.split(',');
			var rgba = {
				r : parseInt(breakColor[0].split('(')[1]),
				g : parseInt(breakColor[1]),
				b : parseInt(breakColor[2]),
				a : 1
			}
			color = cfd.rgbaToHex(rgba, rgba);
		}
		var options = {
			mainHex : color
		}
		versionPalette(options);
		$('body').css('overflow','hidden');
		$('.about').fadeIn(200);
		$('.about-container').show('drop', { direction:'down' }, 200, function(){
			$('body').css('overflow','auto');
			$('.about').css('cursor', 'url(close.gif), crosshair');
		});
	});
	
	$('#container').on('click','.about',function(){
		$('.about').css('cursor', 'auto');
		$('body').css('overflow','hidden');
		$('.about').fadeOut(200);
		$('.about-container').hide('drop', { direction:'down' }, 200, function(){
			$('body').css('overflow','auto');
		});
		
	});
	
	window.onpopstate = function(event) {
		if(event.state !== null){
			refreshUI(event.state.scheme);
		}
	};

});

function initialize(){
	var scheme = checkForUrlValues();
	
	$("#color_select").spectrum({
		showInput: true,
		showButtons: false,
		preferredFormat: "hex"
	});
	
	if(scheme !== null){
		refreshUI(scheme);
	}
	else {
		randomScheme();
	}	
	
	$("#color_select").on('change.spectrum', function(e, tinycolor) { 
		var options = {
			mainHex : tinycolor.toHexString()
		}
		palette(options);
	});
	
	var clipboard = new Clipboard('.color');
	
	clipboard.on('success', function(e) {
		var $element = $(e.trigger);
		var color = $element.attr('class').replace(' color','');

		if(!$('.' + color + '.hex .hint')[0]){
			$('.' + color + '.hex').append('<span class="hint">copied to clipboard</span>').show(function(){
				$('.hint').fadeOut(1000, function(){
					$(this).remove();
				});
			});
		}
	});

	clipboard.on('error', function(e) {
		var $element = $(e.trigger);
		var color = $element.attr('class').replace(' color','');
		
		if(!$('.' + color + '.hex .hint')[0]){
			$('.' + color + '.hex').append('<span class="hint">ctrl+c to copy</span>').show(function(){
				$('.hint').fadeOut(1000, function(){
					$(this).remove();
				});
			});
		}
	});
}

function checkForUrlValues(){
	var scheme = null;
	var currentState = window.location.pathname;
	var hrefArray = currentState.split('/');
	var hexString = hrefArray[hrefArray.length - 1];
	if(hexString.match(/^(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})$/ig) !== null){
		var colorsArray = hexString.split('-');
		scheme = {
			main : '#' + colorsArray[0],
			complementary : '#' + colorsArray[1],
			texts : '#' + colorsArray[2],
			background : '#' + colorsArray[3],
		};
		
		history.replaceState({scheme: scheme}, 'Color for devs');
	}
	
	return scheme;
}

function randomScheme(){
	var scheme = cfd.random();
	refreshUI(scheme);
	
	history.pushState({scheme: scheme}, 'Color for devs', '/'+scheme.noHash.main+'-'+scheme.noHash.complementary+'-'+scheme.noHash.texts+'-'+scheme.noHash.background+'');
}

function palette(options){
	var scheme = cfd.palette(options);
	refreshUI(scheme);
	
	history.pushState({scheme: scheme}, 'Color for devs', '/'+scheme.noHash.main+'-'+scheme.noHash.complementary+'-'+scheme.noHash.texts+'-'+scheme.noHash.background+'');
}

function versionPalette(options){
	var scheme = cfd.palette(options);
	refreshVersionPalette(scheme);
}

function refreshUI(scheme){
	var background = cfd.hexOpacity(scheme.main, 0.1, '#FFFFFF');
	var hexString = cfd.hexOpacity(scheme.main, 0.6, background);
	
	if (cfd.hexLuminocity(background) > 0.85 && cfd.hexLuminocity(hexString) > 0.85){
		var hexString = cfd.hexOpacity(hexString, 0.9, '#424242');
	}
	
	var textsColor = cfd.hexBlendOverlay(scheme.main, 0.2, '#424242');
	
	$('.base.color').css({
		'background' : scheme.main
	});
		
	$('.complementary.color').css({
		'background' : scheme.complementary
	});
		
	$('.shadows.color').css({
		'background' : scheme.texts
	});
		
	$('.background.color').css({
		'background' : scheme.background
	});
		
	$('.results').css({
		'background' : background 
	});
		
	$('.base.hex').html('<span class="string">' + scheme.main + '</span>');
	$('.complementary.hex').html('<span class="string">' + scheme.complementary + '</span>');
	$('.shadows.hex').html('<span class="string">' + scheme.texts + '</span>');
	$('.background.hex').html('<span class="string">' + scheme.background + '</span>');
	
	$('.colorsHex').css({
		'color' : hexString
	});
	
	$('.main, .sp-preview').css({
		'color' : textsColor
	});
	
	$('.base_selection .button_fa, .sp-preview').css({
		'background' : scheme.main
	});
	
	$('.line').css({
		'background' : textsColor
	});
	
	$('#color_select').spectrum("set", scheme.main);
	
	checkLuminocity(scheme);	
	
	function checkLuminocity(scheme){
		var baseLuminocity = cfd.hexLuminocity(scheme.main);
		var complementaryLuminocity = cfd.hexLuminocity(scheme.complementary);
		var shadowsLuminocity = cfd.hexLuminocity(scheme.texts);
		var backgroundLuminocity = cfd.hexLuminocity(scheme.background);
		
		if(baseLuminocity <= 0.8){
			$('.base.hex .string').addClass('light');
		}
		if(complementaryLuminocity <= 0.8){
			$('.complementary.hex .string').addClass('light');
		}
		if(shadowsLuminocity <= 0.8){
			$('.shadows.hex .string').addClass('light');
		}
		if(backgroundLuminocity <= 0.8){
			$('.background.hex .string').addClass('light');
		}
	}
}

function refreshVersionPalette(scheme){
	$('.base.version').css({
		'background' : scheme.main
	});
		
	$('.complementary.version').css({
		'background' : scheme.complementary
	});
		
	$('.shadows.version').css({
		'background' : scheme.texts
	});
		
	$('.background.version').css({
		'background' : scheme.background
	});
	
	$('.about-main').css({
		'color' : scheme.texts
	});
}