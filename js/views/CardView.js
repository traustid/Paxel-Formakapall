define(function(require){

	var Backbone = require('backbone');
	var _ = require('underscore');
	var $ = require('jquery');

	var Deck = require('collections/Deck');
	var Card = require('models/Card');

	return Backbone.View.extend({
		initialize: function(options) {
			this.options = options;
			this.render();
		},

		events: {
			'click .card': 'clickHander'
		},

		clickHander: function() {
			this.trigger('click', {
				card: this.model
			});
		},

		render: function() {
			if (this.options.upsideDown) {
				var template = _.template($("#cardBackTemplate").html(), {
					card: this.model
				});
			}
			else {
				var template = _.template($("#cardTemplate").html(), {
					card: this.model
				});
			}

			$(this.el).html(template)

		}
	})
});