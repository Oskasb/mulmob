
var SIMULATION_LOOP;
var NETWORK_LOOP;

ServerGameMain = function(clients, serverWorld) {
	
    this.pieceSpawner = new PieceSpawner(serverWorld);
    
	this.serverWorld = serverWorld;
    this.serverWorld.setPieceSpawner(this.pieceSpawner);
	this.startTime = process.hrtime();
	this.processTime = process.hrtime();
	this.currentTime = 0;
    this.tickComputeTime = 0;
    this.headroom = 0;
	this.simulationTime = 0;
	this.timeDelta = 0;
	this.connectedClients = clients;
	this.gameConfigs = {};
	this.healthData = [];
};


ServerGameMain.prototype.applyGameConfigs = function(gameConfigs) {
	this.gameConfigs = gameConfigs;
	this.pieceSpawner.notifyConfigsUpdated(this.gameConfigs, this.serverWorld.players);
};


ServerGameMain.prototype.applySetupConfig = function(config) {
	console.log("Setup Loop: ", JSON.stringify(config));
	clearInterval(SIMULATION_LOOP);
    clearInterval(NETWORK_LOOP);
	this.setupLoop(config.setup.system.tickSimulationTime, config.setup.system.tickNetworkTime);
};

ServerGameMain.prototype.setupLoop = function(tickSim, tickNet) {
	var _this = this;
    MODEL.SimulationTime = tickSim * 0.001;
    MODEL.NetworkTime = tickNet * 0.001;
    MODEL.NetworkFPS = 1 / MODEL.NetworkTime;
    MODEL.SimulationFPS = 1 / MODEL.SimulationTime;
    
	console.log("Setup Loop: ", tickSim, tickNet);
    
    SIMULATION_LOOP = setInterval(function() {
		_this.tickGameSimulation();
	}, tickSim);

    NETWORK_LOOP = setInterval(function() {
        _this.tickGameNetwork();
    }, tickNet);
};

ServerGameMain.prototype.endServerGame = function() {
	console.log("End Server Game:");
	clearInterval(SERVER_LOOP);
    this.removeAllPlayers()
};

ServerGameMain.prototype.removeAllPlayers = function() {
    for (var key in this.connectedClients.connectedClients) {
       this.playerDiconected(key);
    }

};

ServerGameMain.prototype.initGame = function() {
	var _this = this;

	function fireCannon(piece, action, value, moduleData) {
        var bulletPiece = _this.pieceSpawner.spawnBullet(piece, moduleData, _this.getNow(), _this.gameConfigs.PIECE_DATA, _this.gameConfigs)
        _this.serverWorld.addWorldPiece(bulletPiece);
	}

    function applyControl(piece, action, value, moduleData) {
        _this.serverWorld.applyControlModule(piece, moduleData, action, value);
    }

	function applyRotation(piece, action, value, moduleData) {
		_this.serverWorld.applyModuleControl(piece, moduleData, action, value);
	}


	this.actionHandlers = {
		fireCannon:fireCannon,
		applyRotation:applyRotation,
        applyControl:applyControl
	};
	
	this.serverWorld.initWorld(this.connectedClients);
};


ServerGameMain.prototype.playerDiconected = function(clientId) {
	var player = this.serverWorld.getPlayer(clientId);
	if (!player) return;

	player.piece.setState(GAME.ENUMS.PieceStates.REMOVED);
	var packet = player.makePacket();
	this.serverWorld.removePlayer(player.id);
	return packet;
};


ServerGameMain.prototype.playerInput = function(data, clientId) {
    console.log(data, clientId)
	var player = this.serverWorld.getPlayer(clientId);
    if (!player) return;
	player.processPlayerInputUpdate(data, this.actionHandlers);
};

ServerGameMain.prototype.registerPlayer = function(data) {

	var client = this.connectedClients.getClientById(data.clientId);
    if (!client) {
        console.log("Somethingm broken, no client...");
        return;
    }
    var player = this.pieceSpawner.spawnPlayerPiece(client, data, this.connectedClients, this.simulationTime, this.gameConfigs);

    this.serverWorld.addPlayer(player);
    client.broadcastToVisible(player.makePacket());


};

ServerGameMain.prototype.getNow = function() {
	this.processTime = process.hrtime(this.startTime);
	return ((this.processTime[0]*1000) + (this.processTime[1]/1000000))*0.001;
};



ServerGameMain.prototype.tickGameSimulation = function() {
    this.headroom = this.getNow() - this.currentTime;
	this.currentTime = this.getNow();

    this.serverWorld.tickSimulationWorld(this.currentTime);
    this.tickComputeTime = this.getNow() - this.currentTime;
    if (Math.random() < 0.01) console.log("Load: ", this.headroom / this.tickComputeTime);

	this.healthData.push({time:this.currentTime, idle:this.headroom, busy:this.tickComputeTime, pieces:this.serverWorld.pieces.length,players:this.serverWorld.playerCount});
};

ServerGameMain.prototype.tickGameNetwork = function() {
//    this.currentTime = this.getNow();
    this.serverWorld.tickNetworkWorld(this.currentTime);

	var sendData = [];

	for (var i = 0; i < this.healthData.length; i++) {
		sendData.push(this.healthData[i]);
	}

	this.connectedClients.broadcastToAllClients({id:"server_status", data:sendData});
	this.healthData = [];
};
