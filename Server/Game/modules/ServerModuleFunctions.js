ServerModuleFunctions = function(serverGameMain, serverWorld, pieceSpawner) {
    this.serverGameMain = serverGameMain;
    this.serverWorld = serverWorld;
    this.pieceSpawner = pieceSpawner;
    this.serverPieceProcessor = this.serverWorld.serverPieceProcessor;
};

ServerModuleFunctions.prototype.clampModuleRotation = function(module, angle, clamp) {
    return MATH.radialClamp(angle , module.state.value - clamp, module.state.value + clamp);
};



ServerModuleFunctions.prototype.applyModulePitch = function(sourcePiece, moduleData) {

    if (!moduleData.applies.master_module_id) {
        console.log("No master module for rotate function");
        return;
    }

    var target = this.serverWorld.getPieceById(sourcePiece.getModuleById(moduleData.applies.master_module_id).state.value);

    var clamp = moduleData.applies.rotation_velocity * moduleData.applies.cooldown;

    var angle = 0;
    if (!target) {
        angle = this.clampModuleRotation(sourcePiece.getModuleById(moduleData.id), angle, clamp);
        sourcePiece.setModuleState(moduleData.id, angle);
    } else {

        if (moduleData.id == 'cannon_pitch') {
            angle = this.serverPieceProcessor.getDistanceFromPieceToTarget(sourcePiece, target)*0.007;
            angle = this.clampModuleRotation(sourcePiece.getModuleById(moduleData.id), angle, clamp);
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

    var clamp = moduleData.applies.rotation_velocity * moduleData.applies.cooldown;

    var target = this.serverWorld.getPieceById(sourcePiece.getModuleById(moduleData.applies.master_module_id).state.value);

    var angle = 0;
    if (!target) {
        angle = this.clampModuleRotation(sourcePiece.getModuleById(moduleData.id), angle, clamp);
        sourcePiece.setModuleState(moduleData.id, angle);
    } else {

        if (moduleData.id == 'tank_turret') {
            angle = this.serverPieceProcessor.getAngleFromPieceToTarget(sourcePiece, target) ; //  moduleData.transform.rot[moduleData.applies.rotation_axis];
            angle = MATH.angleInsideCircle(sourcePiece.spatial.yaw() + angle);

            if (isNaN(sourcePiece.getModuleById(moduleData.id).state.value)) return;

            console.log("No master module for rotate function", sourcePiece.getModuleById(moduleData.id).state.value);
            angle = this.clampModuleRotation(sourcePiece.getModuleById(moduleData.id), angle, clamp);
            sourcePiece.setModuleState(moduleData.id, angle);
        }

    }

//    sourcePiece.processModuleStates();
    sourcePiece.networkDirty = true;
};