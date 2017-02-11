"use strict";


define([
        '3d/GooEntityFactory',
        'game/modules/ModuleEffect',
        'game/modules/ModuleEmitter',
        'game/modules/ModuleModel',
        'Events'
    ],
    function(
        GooEntityFactory,
        ModuleEffect,
        ModuleEmitter,
        ModuleModel,
        evt
    ) {




        var GooModule = function(module, piece, gooParent, attachmentPoint) {

            this.calcVec = new goo.Vector3();
            this.calcVec2 = new goo.Vector3();
            this.calcVec3 = new goo.Vector3();

            this.tempSpatial = new MODEL.Spatial();

            this.transform = attachmentPoint.transform;

            this.moduleSpatial = new MODEL.Spatial();
            this.moduleSpatial.setSpatial(this.transform);


            this.particles = [];
            this.piece = piece;
            this.module = module;
            this.applies = module.data.applies;
            this.flicker = 0;
            this.animate = this.applies.animate;

            if (this.applies) {

                if (this.applies.bundle_model) {
                    this.moduleModel = new ModuleModel(gooParent);
                    this.moduleModel.attachModuleModel(this.applies.bundle_model);
                }

                if (this.applies.module_model_child) {
                    this.moduleModel = new ModuleModel(gooParent);

                    this.moduleModel.attachEntityToModule(this.applies.module_model_child);

                }

                this.entity = gooParent;

                if (this.applies.game_effect) {
                    this.moduleEffect = new ModuleEffect();
                    this.moduleEffect.setupEffectModelData(this.applies, this.piece, this.tempSpatial, this.transform);
                } else if (this.applies.emit_effect) {
                    this.moduleEmitter = new ModuleEmitter();
                    this.moduleEmitter.setupEmitEffectData(this.applies, this.piece, this.tempSpatial, this.transform);
                }

                if (this.applies.spawn_effect) {
                    evt.fire(evt.list().GAME_EFFECT, {effect:module.data.applies.spawn_effect, pos:piece.spatial.pos, vel:piece.spatial.vel});
                }
            }

            if (this.transform) {
                //    this.readWorldTransform(this.transform.pos, this.transform.rot)
            }

        };


        GooModule.prototype.activateGooModule = function() {
            if (this.moduleEffect) {
                this.moduleEffect.gameEffect.startGooEffect()
            }
        };


        GooModule.prototype.removeModule = function() {

            if (this.applies.remove_effect) {
                this.tempSpatial.stop();
                evt.fire(evt.list().GAME_EFFECT, {effect:this.applies.remove_effect, pos:this.piece.spatial.pos, vel:this.tempSpatial.rot});
            }

            if (this.moduleEffect) {
                this.moduleEffect.gameEffect.removeGooEffect();
            }

            this.entity.removeFromWorld();
        };


        GooModule.prototype.inheritEntityWorldTransform = function(pos) {

            this.entity.transformComponent.updateWorldTransform();
            this.entity.transformComponent.worldTransform.rotation.toAngles(this.calcVec);
            this.calcVec3.setDirect(pos[0], pos[1], pos[2]);
            this.calcVec3.applyPost(this.entity.transformComponent.worldTransform.rotation);
            this.calcVec3.addVector(this.entity.transformComponent.worldTransform.translation);
            this.tempSpatial.setPosXYZ(this.calcVec3.x, this.calcVec3.y, this.calcVec3.z);

        };

        GooModule.prototype.calcLocalTargetAngle = function(stateValue) {
            return stateValue;
            var ang = MATH.radialLerp(this.transform.rot[this.applies.rotation_axis], stateValue, this.applies.rotation_velocity);

            ang = MATH.radialClamp(ang, this.transform.rot[this.applies.rotation_axis]-this.applies.rotation_velocity*0.2, this.transform.rot[this.applies.rotation_axis]+this.applies.rotation_velocity*0.2);

            return ang;
        };

        GooModule.prototype.angleDiffForAxis = function(angle, axis) {
            return angle // - this.piece.spatial[axis]();
        };


        GooModule.prototype.applyAngleRotationAxisToSpatial = function(angle, rotation, spatial) {
            spatial.fromAngles(
                angle*rotation[0],
                angle*rotation[1],
                angle*rotation[2]
            );
        }


        GooModule.prototype.randomPosWithinExtents = function(angle, axis) {
            return angle // - this.piece.spatial[axis]();
        };


        GooModule.prototype.updateGooModule = function() {

            if (!this.applies) return;
            if (!this.transform) return;


        //    this.tempSpatial.setSpatial(this.piece.spatial);
            //    this.tempSpatial.pos.addVec(this.moduleSpatial.pos);

            if (this.applies.spatial_axis) {
                var diff = this.angleDiffForAxis(this.module.state.value, this.applies.spatial_axis);
                this.applyAngleRotationAxisToSpatial(diff, this.transform.rot.data, this.moduleSpatial);

                if (this.moduleModel) {
                    this.moduleModel.applyModuleRotation(this.moduleSpatial.rot.data);
                }
            }

            //    this.tempSpatial.pos.setArray(this.transform.pos);



            this.tempSpatial.setSpatial(this.moduleSpatial);

            if (this.moduleSpatial.getSizeVec().getLengthSquared() > 0.5) {
                //    console.log("has size:", this.transform.size)

            //    this.tempSpatial.addPosXYZ(
            //        this.moduleSpatial.size[0]*(Math.random()-0.5),
            //        this.moduleSpatial.size[1]*(Math.random()-0.5),
            //        this.moduleSpatial.size[2]*(Math.random()-0.5)
            //    );


                    this.inheritEntityWorldTransform(this.tempSpatial.pos.data);
            //    this.tempSpatial.fromAngles(this.moduleSpatial.pitch(), this.moduleSpatial.yaw(), this.moduleSpatial.roll());
                this.tempSpatial.applyYaw(this.piece.spatial.yaw());

            } else {
                this.tempSpatial.addSpatial(this.piece.spatial);

            }
            //    this.tempSpatial.rot.setY()


            if (this.moduleEffect) {



                if (this.module.on) {

                    this.moduleEffect.updateModuleEffect(this.module, this.tempSpatial.pos, this.tempSpatial.rot)

                } else {
                    if (this.moduleEffect.gameEffect.started) {
                        if (!this.moduleEffect.gameEffect.paused) {
                            this.moduleEffect.gameEffect.pauseGooEffect();
                        }
                    }
                }
            }

            if (this.moduleEmitter) {

                if (this.module.on) {

                    this.moduleEmitter.updateModuleEmitter(this.module, this.tempSpatial.pos, this.tempSpatial.rot)
                }

            }

        };



        return GooModule;

    });