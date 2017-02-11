ServerModuleFunctions = function(serverGameMain, serverWorld, pieceSpawner) {
    this.serverGameMain = serverGameMain;
    this.serverWorld = serverWorld;
    this.pieceSpawner = pieceSpawner;
};

ServerModuleFunctions.prototype.initModuleControls = function(serverGameMain) {

};



ServerModuleFunctions.prototype.updateModuleState = function(piece, action, value, moduleData) {

};

ServerModuleFunctions.prototype.fireCannon = function(piece, action, value, moduleData) {
    console.log(action, value, moduleData);

    var bulletPiece = this.pieceSpawner.spawnBullet(piece, moduleData, this.serverGameMain.getNow(), this.serverGameMain.gameConfigs.PIECE_DATA, this.serverGameMain.gameConfigs);
    this.serverWorld.addWorldPiece(bulletPiece);
};

ServerModuleFunctions.prototype.applyControl = function(piece, action, value, moduleData) {
    this.serverWorld.applyControlModule(piece, moduleData, action, value);
};

ServerModuleFunctions.prototype.applyRotation = function(piece, action, value, moduleData) {
    this.serverWorld.applyModuleRotation(piece, moduleData, action, value);
};

ServerModuleFunctions.prototype.requestTeleport = function(piece, action, value, moduleData) {
    piece.requestTeleport();
};