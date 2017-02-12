"use strict";


define(['Events',
    'PipelineAPI',
    'EnvironmentAPI'
], function(
    evt,
    PipelineAPI,
    EnvironmentAPI

    ) {

    var Camera = goo.Camera;
    var CameraComponen = goo.CameraComponent;
    var EntityUtils = goo.EntityUtils;
    var Vector3 = goo.Vector3;
    var Matrix3x3 = goo.Matrix3x3;
    
    var camScript;
    var cameraEntity;
    var playerPiece;
    var g00;
    var camera;
    var forVec;
    var calcVec = new Vector3();
    var calcVec2 = new Vector3();

	var GooCameraController = function() {

	};



	GooCameraController.prototype.getCamera = function() {
		return camera;
	};

    GooCameraController.prototype.getCameraEntity = function() {
        return cameraEntity;
    };

    GooCameraController.prototype.setCameraPosition = function(x, y, z) {
        cameraEntity.transformComponent.transform.translation.setDirect(x, y, z);
        cameraEntity.transformComponent.setUpdated();
    };


    var cameraOffset = new Vector3(0, 0.82, 0);

    var cameras = {

    };


    var setupGooCamera = function(e) {
        g00 = evt.args(e).goo;

        camera = new Camera(45, 1, 0.25, 45000);
        cameraEntity = g00.world.createEntity('ViewCameraEntity');
        var cameraComponent = new goo.CameraComponent(camera);
        cameraEntity.setComponent(cameraComponent);
        cameraEntity.addToWorld();

        cameraEntity.transformComponent.transform.translation.setDirect(0, 10, 0);
        cameraEntity.transformComponent.setUpdated();

        evt.fire(evt.list().CAMERA_READY, {goo:g00, camera:cameraEntity});

        lastPos = new MATH.Vec3(0, 0, 0);
        forVec = new MATH.Vec3(0, 0, 0);
        evt.on(evt.list().CLIENT_TICK, updateCamera);

        var camTick = function() {
            cameraEntity.transformComponent.updateTransform();
            cameraComponent.updateCamera(cameraEntity.transformComponent.transform);

        };
        
        
        evt.on(evt.list().CAMERA_TICK, camTick);
        
    };


    var lastPos;
    var ownPiece;


    var lookAtPoint = new goo.Vector3();
    var camPos = new goo.Vector3();
    var lastLerpPos = new goo.Vector3();

	var updateCamera = function(e) {
        if (!on) return;
        EnvironmentAPI.updateCameraFrame(evt.args(e).tpf, cameraEntity);

        ownPiece = PipelineAPI.readCachedConfigKey('GAME_DATA', 'OWN_PLAYER').ownPiece;

        playerPiece = ownPiece.piece;
        
        playerPiece.spatial.getForwardVector(forVec);

        forVec.scale(4);
        // forVec.addVec(playerPiece.spatial.vel);
        // forVec.scale(0.4);


        cameraEntity.transformComponent.transform.translation.setVector(lastLerpPos);

        calcVec.setDirect(0, 4 + (Math.sqrt(Math.abs(playerPiece.spatial.vel.getZ()*0.2))), 0);

        calcVec.addDirect(forVec.getX(), forVec.getY(), forVec.getZ());

        calcVec2.setDirect(playerPiece.spatial.pos.getX(), playerPiece.spatial.pos.getY(), playerPiece.spatial.pos.getZ());
        //    calcVec.subVector(lastPos);


        camPos.setVector(calcVec2)

        camPos.y += Math.sqrt(Math.max(26 - playerPiece.spatial.vel.getZ()+0.1 + Math.abs(playerPiece.spatial.vel.getX()), 7));

        camPos.z -= 31 - Math.sqrt(Math.sqrt(Math.abs(playerPiece.spatial.vel.getZ()*20.12)) + Math.abs(playerPiece.spatial.vel.getX()*playerPiece.spatial.vel.getX()*0.2));
        camPos.x -= Math.sqrt(Math.abs(playerPiece.spatial.vel.getX()*0.1));



        lastLerpPos.lerp(camPos, 0.3);
        //cameraEntity.transformComponent.transform.translation.setVector(camPos);

        cameraEntity.transformComponent.transform.translation.lerp(lastLerpPos, 0.1);


    //    cameraEntity.transformComponent.transform.translation.x -= playerPiece.spatial.vel.getX()*3;


    //    cameraEntity.transformComponent.transform.translation.setVector(calcVec2);
    //    cameraEntity.transformComponent.transform.translation.y += Math.max(19 - playerPiece.spatial.vel.getZ()+0.1 + Math.abs(playerPiece.spatial.vel.getX()), 7);
    //    cameraEntity.transformComponent.transform.translation.z -= 40 - playerPiece.spatial.vel.getZ()*0.3;
    //    cameraEntity.transformComponent.transform.translation.x -= playerPiece.spatial.vel.getX()*0.3;



        calcVec2.addVector(calcVec);

        lookAtPoint.lerp(calcVec2, 0.1);
        
        cameraEntity.lookAtPoint = lookAtPoint;

        cameraEntity.transformComponent.transform.lookAt(cameraEntity.lookAtPoint, Vector3.UNIT_Y);

    //    cameraEntity.transformComponent.transform.lookAt(calcVec, Vector3.UNIT_Y);
    //    cameraEntity.transformComponent.transform.rotation.toAngles(calcVec);
    //    cameraEntity.transformComponent.transform.rotation.rotateZ(-calcVec.z);

    //    cameraEntity.transformComponent.transform.rotation.

        cameraEntity.transformComponent.setUpdated();
    //    lastPos.setVec(playerPiece.spatial.pos);
	};

    evt.on(evt.list().ENGINE_READY, setupGooCamera);

    var on = false;


    var controlledPieceUpdated = function(e) {
        on=true;
    };

    evt.once(evt.list().CONTROLLED_PIECE_UPDATED, controlledPieceUpdated);


	return GooCameraController

});