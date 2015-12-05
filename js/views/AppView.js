define(function(require){

	var Backbone = require('backbone');
	var _ = require('underscore');
	var $ = require('jquery');

	var Deck = require('collections/Deck');
	var Game = require('views/Game');

	return Backbone.View.extend({
		initialize: function() {
			window.game = new Game({
				el: $('#appView')
			});

			if (window.location.hash != '') {
				$(document.body).attr('class', 'lang-'+window.location.hash.substr(1));
			}
			else {
				$(document.body).attr('class', 'lang-is');
			}

			$('#appView .frame-buttons a').each(function() {
				$(this).css({
					'background-size': $(this).outerWidth()+'px '+$(this).outerHeight()+'px'
				});
			});
		}
	});
});