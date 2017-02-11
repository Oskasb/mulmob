ServerModuleHandler = function(serverModuleFunctions) {
    this.serverModuleFunctions = serverModuleFunctions;
};

ServerModuleHandler.prototype.initModuleControls = function(serverGameMain) {
    this.serverGameMain = serverGameMain;
};



ServerModuleHandler.prototype.handleModuleControlAction = function(piece, actionData) {
    if (actionData.vector) {
        piece.setInputVector(actionData.vector.state);
        piece.networkDirty = true;
        
        return;
    }

    var _this = this;
    var fireActionCallback = function(action, value, moduleData) {
        if (typeof(_this[action]) == 'function') _this[action](piece, action, value, moduleData);
        //	if (typeof(actionHandlers[action]) != 'function') console.log("No Handler:", action, value)
    };

    if (actionData.fire) {
        piece.setInputTrigger(true, fireActionCallback);
        piece.setInputTrigger(false);
        return;
    }

    console.log("Module Action:", piece.id, actionData);
    for (var key in actionData) {
        
        piece.setModuleState(key, actionData[key]);
    }
    
    piece.networkDirty = true;
};


ServerModuleHandler.prototype.fireCannon = function(piece, action, value, moduleData) {
    this.serverModuleFunctions.fireCannon(piece, action, value, moduleData);
};

ServerModuleHandler.prototype.applyControl = function(piece, action, value, moduleData) {

};

ServerModuleHandler.prototype.applyRotation = function(piece, action, value, moduleData) {
    this.serverModuleFunctions.applyRotation(piece, action, value, moduleData);
};