define(function(require){

	var Backbone = require('backbone');
	var _ = require('underscore');
	var $ = require('jquery');

	var Card = require('models/Card');

	return Backbone.Collection.extend({
		model: Card,
		rows: {},
		stack: [],

		types: [
			{
				shape: 'triangle',
				color: 'yellow',
				colorValue: '#f7f944'
			},
			{
				shape: 'square',
				color: 'red',
				colorValue: '#e63e10'
			},
			{
				shape: 'circle',
				color: 'green',
				colorValue: '#9db947'
			},
			{
				shape: 'diamond',
				color: 'blue',
				colorValue: '#4c6eff'
			},
			{
				shape: 'hexagon',
				color: 'purple',
				colorValue: '#d84475'
			}
		],

		initialize: function() {
			this.createCards();
		},

		createCards: function() {
			var cards = [];
			var counter = 1;

			_.each(this.types, function(type) {
				for (var i = 1; i<=10; i++) {
					cards.push({
						id: counter,
						shape: type.shape,
						color: type.color,
						colorValue: type.colorValue,
						number: i,
						variable: ((Math.random()*3)-1.5)
					});

					counter++;					
				}
			});

			this.add(_.shuffle(cards));
		},

		cardsAtRow: function(row) {
			return this.rows[row] == undefined ? [] : this.rows[row];
		},

		cardToRow: function(card, row, cardIndex) {
			if (this.rows[row] == undefined) {
				this.rows[row] = {};
			}
			this.rows[row][cardIndex] = card;

		},

		numCardsInRow: function(row) {
			return _.filter(this.rows[row], function(card) {
				return card != undefined;
			}).length;
		},

		numCardsInRows: function() {
			var count = 0;
			_.each(this.rows, function(row) {
				count += _.filter(row, function(card) {
					return card != undefined;
				}).length;

			});

			return count;
		},

		removeFromRows: function(card) {
			var cardIndex = this.getRowIndex(card);

			if (cardIndex.row > -1) {
				var nextRow = cardIndex.row+1;

				if (cardIndex.row == 6) {
					this.rows[cardIndex.row][cardIndex.card] = undefined;
					return true;
				}
				else if (this.cardsAtRow(nextRow)[cardIndex.card] == undefined && this.cardsAtRow(nextRow)[cardIndex.card+1] == undefined) {
					this.rows[cardIndex.row][cardIndex.card] = undefined;
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		},

		cardToStack: function(card) {
			if (this.getRowIndex(card).row > -1) {
				if (this.removeFromRows(card)) {
					this.stack.push(card);
				}
			}
			else {
				this.stack.push(card);
			}

			if (this.numCardsInRows() == 0) {
				this.trigger('gameSuccess');
			}
			else if (this.availableCards().length == 0) {
				this.trigger('gameOver');
			}
		},

		cardInStack: function(card) {
			var inStack = false;
			_.each(this.stack, function(stackCard) {
				if (stackCard == card) {
					inStack = true;
				}
			});
			return inStack;
		},

		getTopInStack: function() {
			return this.stack[this.stack.length-1];
		},

		getRowIndex: function(card) {
			var rowIndex = -1;
			var cardIndex = -1;

			_.each(this.rows, _.bind(function(row, currentRowIndex) {
				_.each(row, _.bind(function(currentCard, currentCardIndex) {
					if (currentCard == card) {
						rowIndex = Number(currentRowIndex);
						cardIndex = Number(currentCardIndex);
					}
				}, this));
			}, this));

			return {
				row: rowIndex,
				card: cardIndex
			};
		},

		availableCards: function() {
			return this.filter(_.bind(function(card) {
				return this.getRowIndex(card).row == -1 && !this.cardInStack(card);
			}, this));
		},

		nextAvailableCard: function() {
			return this.availableCards()[this.availableCards().length-1]
		}
	})
});