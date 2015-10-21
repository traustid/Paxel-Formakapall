define(function(require){

	var Backbone = require('backbone');
	var _ = require('underscore');
	var $ = require('jquery');

	return Backbone.Model.extend({
		toString: function() {
			return '['+this.get('id')+'] '+this.get('shape')+', '+this.get('color')+', '+this.get('number');
		}
	})
});