define(function(require){

	var Backbone = require('backbone');
	var _ = require('underscore');
	var $ = require('jquery');

	var Deck = require('collections/Deck');
	var Card = require('models/Card');
	var CardView = require('views/CardView');

	return Backbone.View.extend({
		initialize: function() {
			var cardCounter = 0;

			this.collection = new Deck();
			this.collection.on('gameOver', function() {
				console.log('gameOver');
			});
			this.collection.on('gameSuccess', _.bind(function() {
				this.$('.game-done').addClass('visible');
				console.log('gameSuccess');
			}, this));

			for (var r = 1; r<=6; r++) {
				for (var c = 1; c<=r; c++) {
					this.collection.cardToRow(this.collection.at(cardCounter), r, c);
					cardCounter++;
				}
			}

			this.collection.cardToStack(this.collection.nextAvailableCard());

			$(this.el).find('.available-cards').unbind();
			
			$(this.el).find('.available-cards').click(_.bind(function() {
				this.collection.cardToStack(this.collection.nextAvailableCard());

				this.render();
			}, this));

			this.render();

			this.$el.addClass('initialized');
		},

		events: {
			'click .restart-button': 'restartButtonClick'
		},

		restartButtonClick: function() {
			this.$el.removeClass('initialized');
			this.$('.game-done').removeClass('visible');

			setTimeout(_.bind(function() {
				this.initialize();
			}, this), 400);
		},

		rowCardClick: function(event) {

			if (this.collection.getTopInStack().get('number') == event.card.get('number')-1 || 
					this.collection.getTopInStack().get('number') == event.card.get('number')+1 ||
					(this.collection.getTopInStack().get('number') == 1 && event.card.get('number') == 10) ||
					(this.collection.getTopInStack().get('number') == 10 && event.card.get('number') == 1)) {
				this.moveCard(event.card, 'row', 'stack', _.bind(function() {
					this.collection.cardToStack(event.card);
					this.render();
				}, this));
			}
		},

		moveCard: function(card, from, to, onComplete) {
			if (from == 'row') {
				var cardEl = $('#card-'+card.get('id'));

				var currentPosition = cardEl.offset();

				cardEl.css('visibility', 'hidden');

				var clone = $(cardEl.html());

				$(this.el).find('.animation-layer').css('display', 'block');
				$(this.el).find('.animation-layer').append(clone);

				clone.offset(currentPosition);

				if (to == 'stack') {
					var topStackCard = $(this.el).find('.card-stack .card-wrapper:last-child');

					var topStackCardPosition = topStackCard.offset();

					clone.animate({
						top: topStackCardPosition.top-8,
						left: topStackCardPosition.left-8
					}, 500, _.bind(function() {
						onComplete();

						this.clearAnimationLayer();
					}, this));
				}
			}
			else {
				onComplete();
			}
		},

		clearAnimationLayer: function() {
			$(this.el).find('.animation-layer').css('display', 'none');
			$(this.el).find('.animation-layer').html('');
		},

		preloadImages: function() {
			var images = this.collection.map(function(card) {
				return 'img/cards/'+card.get('shape')+'-'+card.get('number')+'.png';
			});

			_.each(images, function(image) {
		        $('<img />').attr('src' ,image).appendTo('body').css('display','none');
			});
		},

		render: function() {
			this.preloadImages();

			var rowsEl = $(this.el).find('.rows');
			rowsEl.html('');

			var deckEl = $(this.el).find('.available-cards');
			deckEl.html('');

			var cardStackEl = $(this.el).find('.card-stack');
			cardStackEl.html('');

			var cardStackEl = $(this.el).find('.card-stack');
			cardStackEl.html('');

			_.each(this.collection.rows, _.bind(function(row, rowIndex)  {
				var rowEl = $('<div class="row"></div>');
				rowsEl.append(rowEl);

				_.each(row, _.bind(function(card, cardIndex)  {
					var cardEl = $('<div"'+(card != undefined ? ' id="card-'+card.get('id')+'"' : '')+'" class="card-wrapper"/>');
					(new CardView({
						el: cardEl,
						model: card
					})).on('click', _.bind(this.rowCardClick, this));

					rowEl.append(cardEl);
				}, this));
			}, this));

			_.each(this.collection.availableCards(), function(card, index)  {
				var cardEl = $('<div"'+(card != undefined ? ' id="card-'+card.get('id')+'"' : '')+'" class="card-wrapper" style="margin-top: '+index*5+'px;"/>');
				new CardView({
					el: cardEl,
					model: card,
					upsideDown: true
				});

				deckEl.append(cardEl);
			});

			_.each(this.collection.stack, function(card, index)  {
				var cardEl = $('<div"'+(card != undefined ? ' id="card-'+card.get('id')+'"' : '')+'" class="card-wrapper"/>');

				new CardView({
					el: cardEl,
					model: card
				});

				cardStackEl.append(cardEl);
			});
		}
	})
});