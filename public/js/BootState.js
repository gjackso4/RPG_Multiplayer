var rpg = rpg || {};

rpg.BootState = {
	init: function() {
		this.game.stage.backgroundColor = '#FFF';
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
	},
	preload: function() {
		this.load.image('preloadbar', 'assets/images/preloader-bar.png');
	},
	create: function() {
		this.state.start('Preload');
	}
}