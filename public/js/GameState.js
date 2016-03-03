var rpg = rpg || {};

rpg.GameState = {
	init: function(currentlevel) {

	this.currentLevel = currentlevel ? currentLevel : 'map1';

	this.PLAYER_SPEED = 90;

	this.game.physics.arcade.gravity.y = 0;

	this.cursors = this.game.input.keyboard.createCursorKeys();

	this.is_connected = false;
	},
	create: function() {
		this.players = [];
		this.socket = io.connect('http://198.57.224.14:3000');
		this.connectionData;
		var scope = this;
		this.socket.on('connected', function (data) {
			rpg.GameState.is_connected = true;
			scope.id = data;
			scope.game.OnscreenControls = scope.game.plugins.add(Phaser.Plugin.OnscreenControls);
			scope.loadLevel();
		});

		 this.socket.on('updated', function (data) {

			var actor = scope.players.filter(function (obj) {
				return obj.playerId == data['playerId'];
			})[0];

			if (actor) {
			    actor.player.x = data['x'];
			    actor.player.y = data['y'];

			} else {
				scope.selfId = rpg.GameState.id['playerId'];
			 	var temp = new rpg.Player(scope, scope.selfId ,100, 100);
			 	scope.players.push({ player: temp, playerId: data['playerId'] });
			 	scope.add.existing(temp);
			}

		 });

	},
	update: function() {
		if(this.is_connected) {
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;

			if(this.cursors.left.isDown || this.player.btnsPressed.left || this.player.btnsPressed.upleft || this.player.btnsPressed.downleft) {
				this.player.body.velocity.x = -this.PLAYER_SPEED;
				this.player.scale.setTo(1,1);
			}
			if(this.cursors.right.isDown || this.player.btnsPressed.right || this.player.btnsPressed.upright || this.player.btnsPressed.downright) {
				this.player.body.velocity.x = this.PLAYER_SPEED;
				this.player.scale.setTo(-1,1);
			}
			if(this.cursors.up.isDown || this.player.btnsPressed.up || this.player.btnsPressed.upleft || this.player.btnsPressed.upright) {
				this.player.body.velocity.y = -this.PLAYER_SPEED;
			}
			if(this.cursors.down.isDown || this.player.btnsPressed.down || this.player.btnsPressed.downleft || this.player.btnsPressed.downright) {
				this.player.body.velocity.y = this.PLAYER_SPEED;
			}

			if(this.game.input.activePointer.isUp) {
				this.game.OnscreenControls.stopMovement();
			}
			if(this.player.body.velocity.x != 0 || this.player.body.velocity.y != 0) {
				this.player.play('walk');
			} else {
				this.player.animations.stop();
				this.player.frame = 0;
			}
			this.game.physics.arcade.collide(this.player, this.collisionLayer); 

			rpg.GameState.socket.emit('update', {playerId: this.player.playerId, x: this.player.x, y: this.player.y, data: this.player.data });
		}
		
	},
	loadLevel: function() {
		this.map = this.add.tilemap(this.currentLevel);

		this.map.addTilesetImage('terrains', 'tilesheet');

		this.backgroundLayer = this.map.createLayer('backgroundLayer');
		this.collisionLayer = this.map.createLayer('collisionLayer');

		this.game.world.sendToBack(this.backgroundLayer);

		this.map.setCollisionBetween(1,16, true, 'collisionLayer');

		this.collisionLayer.resizeWorld();

		//create player
		var playerData = {
			//list of items
			items: [],

			health: 25,
			attach: 12,
			defense: 8,
			gold: 100,

			quests: []
		};

		//creating new instance of player class
		  this.selfId = rpg.GameState.id['playerId'];
		  this.player = new rpg.Player(this, this.selfId ,100, 100, playerData);
		  this.add.existing(this.player);
	      this.game.camera.follow(this.player);

		this.initGUI();
	},
	gameOver: function() {
		this.game.state.start("Game", true, false, this.currentLevel);
	},
	initGUI: function() {
	    //onscreen controls setup
	    this.game.OnscreenControls.setup(this.player, {
	      left: true,
	      right: true,
	      up: true,
	      down: true,
	      upleft: true,
	      downleft: true,
	      upright: true,
	      downright: true,
	      action: false
	    })
	  }
}
