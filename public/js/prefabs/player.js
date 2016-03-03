var rpg = rpg || {};

rpg.Player = function(state, playerId, x, y, data) {
	Phaser.Sprite.call(this, state.game, x, y, 'player');

	this.playerId = playerId;

	this.state = state;
	this.game = state.game;
	this.data = data;
	this.anchor.setTo(0.5);

	//show walking sprite
	this.animations.add('walk', [0,1,0], 6, false);

	//enable physics
	this.game.physics.arcade.enable(this);

	// rpg.GameState.socket.emit('update', {playerId: this.playerId, x: this.x, y: this.y, data: this.data });
}

rpg.Player.prototype = Object.create(Phaser.Sprite.prototype);
rpg.Player.prototype.constructor = rpg.Player;
