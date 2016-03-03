var rpg = rpg || {};

rpg.dim = rpg.getGameLandscapeDimensions(440,400);

rpg.game = new Phaser.Game(rpg.dim.w, rpg.dim.h, Phaser.AUTO);

rpg.game.state.add('Boot', rpg.BootState);
rpg.game.state.add('Preload', rpg.PreloadState);
rpg.game.state.add('Connection', rpg.ConnectionState);
rpg.game.state.add('Game', rpg.GameState);

rpg.game.state.start('Boot');
