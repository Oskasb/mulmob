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


        var calcVec = new goo.Vector3();
        var calcVec2 = new goo.Vector3();
        var calcVec3 = new goo.Vector3();

        var GooModule = function(module, piece, gooParent, attachmentPoint) {
            
            this.tempSpatial = {
                pos:new MATH.Vec3(0, 0, 0),
                rot:new MATH.Vec3(0, 0, 0)
            };
            
            this.transform = attachmentPoint.transform;

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
                this.readWorldTransform(this.transform.pos, this.transform.rot)
            }
            
        };
        

        GooModule.prototype.activateGooModule = function() {
            if (this.moduleEffect) {
                this.moduleEffect.gameEffect.startGooEffect()
            }
        };


        GooModule.prototype.removeModule = function() {


            if (this.applies.remove_effect) {
                this.tempSpatial.rot.setXYZ(0, 0, 0);
                evt.fire(evt.list().GAME_EFFECT, {effect:this.applies.remove_effect, pos:this.piece.spatial.pos, vel:this.tempSpatial.rot});
            }

            if (this.moduleEffect) {
                this.moduleEffect.gameEffect.removeGooEffect();
            }


            this.entity.removeFromWorld();
        };





        GooModule.prototype.readWorldTransform = function(pos) {

            this.entity.transformComponent.updateWorldTransform();

            this.entity.transformComponent.worldTransform.rotation.toAngles(calcVec);

            calcVec3.setDirect(pos[0], pos[1], pos[2]);

            calcVec3.applyPost(this.entity.transformComponent.worldTransform.rotation);
            this.tempSpatial.pos.setXYZ(calcVec3.x, calcVec3.y, calcVec3.z);


            this.tempSpatial.pos.data[0] += this.entity.transformComponent.worldTransform.translation.x;
            this.tempSpatial.pos.data[1] += this.entity.transformComponent.worldTransform.translation.y;
            this.tempSpatial.pos.data[2] += this.entity.transformComponent.worldTransform.translation.z;

        };


        GooModule.prototype.updateGooModule = function() {

            if (this.applies) {

                if (this.transform) {

                    if (this.applies.action) {
                        if (this.applies.action == "applyRotation") {
                        //    console.log(this.module.state.value)

                            var ang = MATH.radialLerp(this.transform.rot[this.applies.rotation_axis], this.module.state.value, this.applies.rotation_velocity)

                            ang = MATH.radialClamp(ang, this.transform.rot[this.applies.rotation_axis]-this.applies.rotation_velocity*0.2, this.transform.rot[this.applies.rotation_axis]+this.applies.rotation_velocity*0.2);

                            this.transform.rot[this.applies.rotation_axis] = ang;

                            if (this.moduleModel) {
                                this.moduleModel.applyModuleRotation(this.transform.rot);
                            }
                            
                        }
                    }

                    this.tempSpatial.pos.setArray(this.transform.pos)

                    if (this.transform.size) {
                    //    console.log("has size:", this.transform.size)

                        this.tempSpatial.pos.data[0] += this.transform.size[0]*(Math.random()-0.5);
                        this.tempSpatial.pos.data[1] += this.transform.size[1]*(Math.random()-0.5);
                        this.tempSpatial.pos.data[2] += this.transform.size[2]*(Math.random()-0.5);
                    }

                    this.readWorldTransform(this.tempSpatial.pos.data);
                    this.tempSpatial.rot.setXYZ(this.transform.rot[0], this.transform.rot[1]*Math.random(), this.transform.rot[2]);
                    this.tempSpatial.rot.rotateY(this.piece.spatial.rot);
                //    this.tempSpatial.rot.setY()
                } else {
                    this.tempSpatial.pos.setVec(this.piece.spatial.pos);
                    this.tempSpatial.rot.setY(this.piece.spatial.rot);
                }
                
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

            }
        };



        return GooModule;

    });