var app = angular.module('colorIpsum',['ngAnimate']);

app.controller('mainController', ['$scope', 'coloripsum', '$timeout', function($scope, coloripsum, $timeout) {
	
	$scope.versionColor = '#E52B50';
	$scope.version = '1.6';
	
	$scope.scheme = {
		main : '#000000',
		complementary : '#000000',
		dark : '#000000',
		light : '#000000',
		noHash : {
			main : '000000',
			complementary : '000000',
			dark : '000000',
			light : '000000'
		},
		luminocity : {
			main : 1,
			complementary : 1,
			dark : 1,
			light : 1
		},
		uiColors : {
			background : '#000000',
			hex : '#000000',
			texts : '#000000'
		}
	};
	
	$scope.rotate = false;
	
	var scheme = checkForUrlValues();
	
	//Check if is given with URL values or not
	if(scheme !== null){
		$scope.scheme = generatePaletteFromURL(scheme);
	}
	else {
		$scope.scheme = randomScheme();
	}	
	
	$scope.onKeyUp = function($event){
		if($event.keyCode == 32) {
			$scope.scheme = randomScheme();
		}
	}
	
	$scope.generateRandom = function($event){
		$scope.rotate = true;
		
		$timeout(function(){ 
			$scope.rotate = false;
		},700);
		
		
		$scope.scheme = randomScheme();
	}
	
	//Needed palette function to be accessible from scope to use it in spectrum directive
	$scope.generatePalette = function(options){
		return palette(options);
	}
	
	$scope.buildInfo = function(){
		var options = {
			mainHex : $scope.versionColor
		}
		$scope.versionScheme = versionPalette(options);
		$('body').css('overflow','hidden');
		$('.about').fadeIn(200);
		$('.about-container').show('drop', { direction:'down' }, 200, function(){
			$('body').css('overflow','auto');
		});
	}
	
	$scope.closeAbout = function($event){
        var target = $event.target.className;
        if(target === "panel about"){
            $('.about').css('cursor', 'auto');
            $('body').css('overflow','hidden');
            $('.about').fadeOut(200);
            $('.about-container').hide('drop', { direction:'down' }, 200, function(){
                $('body').css('overflow','auto');
            });
        }
	}
    
    $scope.changeCursor = function($event){
        var target = $event.target.className;
        if(target === "panel about"){
            $('.about').css('cursor', 'url(close.gif), crosshair');
        }
        else {
            $('.about').css('cursor', 'auto');
        }
	}
	
	$scope.selectHexString = function($event){
		var elementClass = $event.currentTarget.className;
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
	}
	
	//Copy to clipboard plugin
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
	
	window.onpopstate = function(event) {
		if(event.state !== null){
			$scope.$apply(function() {
				$scope.scheme = event.state.scheme;
			});
		}
	};
	
	/**
    * Checks and validates if there are colors hex passed in URL
    *
    */
	function checkForUrlValues(){
		var scheme = null;
		var currentPath = window.location.pathname;
		var pathArray = currentPath.split('/');
		var hexString = pathArray[pathArray.length - 1];
		if(hexString.match(/^(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})$/ig) !== null){
			var colorsArray = hexString.split('-');
			scheme = {
				main : '#' + colorsArray[0],
				complementary : '#' + colorsArray[1],
				dark : '#' + colorsArray[2],
				light : '#' + colorsArray[3],
				noHash : {
					main : colorsArray[0],
					complementary : colorsArray[1],
					dark : colorsArray[2],
					light : colorsArray[3]
				}
			};
		}
		
		return scheme;
	}
	
	/**
    * Generates color palette based on URL
    *
    */
	function generatePaletteFromURL(options){
		var scheme = coloripsum.generatePaletteFromURL(options);
		
		historyRefresh(scheme, 'Colors for devs');
		
		return scheme;
	}
	
	/**
    * Generate a random color scheme 
    *
    */
	function randomScheme(){
		var scheme = coloripsum.random();
		
		historyRefresh(scheme, 'Colors for devs');
		
		return scheme;
	}
	
	/**
    * Generate a palette based on base colors 
    *
	* @param {obj} options		{mainHex, darkHex, lightHex}
    */
	function palette(options){
		var scheme = coloripsum.palette(options);
		
		historyRefresh(scheme, 'Colors for devs');
		
		return scheme;
	}
	
	/**
    * Generate the current version palette
    *
	* @param {obj} options		{mainHex, darkHex, lightHex}
    */
	function versionPalette(options){
		var scheme = coloripsum.palette(options);
		
		return scheme;
	}
	
	/**
    * Manage HTML5 history url change (push or replace)
    *
	* @param {obj} scheme		The current scheme
	* @param {str} title        The page title
    */
	function historyRefresh(scheme, title){
		var currentPath = window.location.pathname;
		var pathArray = currentPath.split('/');
		var currentURL = '/'+pathArray[pathArray.length - 1];
		
		var newURL =  '/'+scheme.noHash.main+'-'+scheme.noHash.complementary+'-'+scheme.noHash.dark+'-'+scheme.noHash.light+'';
		
		if(newURL === currentURL){
			history.replaceState({scheme: scheme}, title);
		}
		else {
			history.pushState({scheme: scheme}, title, newURL);
		}
	}
}]);


/**
* Directive for spectrum jQuery plugin
*
*/
app.directive('spectrum', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).spectrum(scope.$eval(attrs.spectrum));
			$(element).on('change.spectrum', function(e, tinycolor) { 
				var options = {
					mainHex : tinycolor.toHexString()
				}
				
				scope.$apply(function() {
					scope.scheme = scope.generatePalette(options);
				});
			});
			scope.$watch('scheme', function(color) {
				$(element).spectrum("set", color.main);
				
				$('.sp-preview').css({
					'color' : color.uiColors.texts
				});
				
				$('.sp-preview').css({
					'background' : color.main
				});
			});
        }
    };
});

/**
* Directive to focus on an element
*
* Can't give isolated scope because it will result in $compile:multidir error
*/
app.directive('setFocus', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element[0].focus();
        }
    };
});