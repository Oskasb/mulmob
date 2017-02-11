ServerModuleFunctions = function(serverGameMain, serverWorld, pieceSpawner) {
    this.serverGameMain = serverGameMain;
    this.serverWorld = serverWorld;
    this.pieceSpawner = pieceSpawner;
    this.serverPieceProcessor = this.serverWorld.serverPieceProcessor;
};

ServerModuleFunctions.prototype.initModuleControls = function(serverGameMain) {

};


ServerModuleFunctions.prototype.applyModulePitch = function(sourcePiece, moduleData) {

    if (!moduleData.applies.master_module_id) {
        console.log("No master module for rotate function");
        return;
    }

    var target = this.serverWorld.getPieceById(sourcePiece.getModuleById(moduleData.applies.master_module_id).state.value);

    var angle = 0;
    if (!target) {
        sourcePiece.setModuleState(moduleData.id, angle);
    } else {

        if (moduleData.id == 'cannon_pitch') {
            angle = this.serverPieceProcessor.getDistanceFromPieceToTarget(sourcePiece, target)*0.003;
            sourcePiece.setModuleState(moduleData.id, MATH.clamp(angle, moduleData.applies.rotation_min, moduleData.applies.rotation_max));
        }
    }

    sourcePiece.networkDirty = true;

};

ServerModuleFunctions.prototype.applyModuleYaw = function(sourcePiece, moduleData) {
    //   sourcePiece.pieceControls.setControlState(moduleData, action, value);

    //   console.log("Turret State:",sourcePiece.getModuleById("tank_turret").state.value);

//    console.log("SelectedTarget State:",sourcePiece.getModuleById("input_target_select").state.value);

    if (!moduleData.applies.master_module_id) {
        console.log("No master module for rotate function");
        return;
    }

    var target = this.serverWorld.getPieceById(sourcePiece.getModuleById(moduleData.applies.master_module_id).state.value);

    var angle = 0;
    if (!target) {
        sourcePiece.setModuleState(moduleData.id, angle);
    } else {

        if (moduleData.id == 'tank_turret') {
            angle = this.serverPieceProcessor.getAngleFromPieceToTarget(sourcePiece, target); //  moduleData.transform.rot[moduleData.applies.rotation_axis];
            sourcePiece.setModuleState(moduleData.id, MATH.angleInsideCircle(sourcePiece.spatial.yaw() + angle));
        }

    }

//    sourcePiece.processModuleStates();
    sourcePiece.networkDirty = true;
};