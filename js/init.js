requirejs.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	baseUrl: 'js/',
	paths: {
		jquery: 'lib/jquery.min',				
		backbone: 'lib/backbone-min',
		underscore: 'lib/underscore-min'
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},

		'underscore': {
			exports: '_'
		},

		'jquery': {
			exports: '$'
		}
	}
});

require(['js/views/AppView.js'],function(AppView){
	var appView = new AppView();
});
