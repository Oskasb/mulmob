"use strict";


define([
        '3d/effects/GooGameEffect',
        'Events'
    ],
    function(
        GooGameEffect,
        evt
    ) {
        
        var ModuleEffect = function() {

            this.gameEffect = new GooGameEffect();

            this.effectData = {
                params:{},
                state:{}
            };
        };

        ModuleEffect.prototype.setupEffectModelData = function(applies, piece, tempSpatial, transform) {

            this.applies = applies;
            
            if (!applies.state_factor) applies.state_factor = 1;

            var effectData = applies.effect_data;

            for (var key in effectData) {
                if (effectData[key].length) {
                    this.effectData.params[key] = [];
                    this.effectData.state[key] = [];
                    for (var i = 0; i < effectData[key].length; i++) {
                        this.effectData.params[key][i] = effectData[key][i];
                        this.effectData.state[key][i] = effectData[key][i];
                    }
                } else {
                    this.effectData.params[key] = effectData[key] / applies.state_factor;
                    this.effectData.state[key] = 0;
                }
            }

            var getRotation = function() {
                return -piece.spatial.rot.data[0]+transform.rot[2];
            };

            var getPosition = function() {

                if  (transform) {
                    // _this.readWorldTransform(_this.applies.transform.pos, _this.applies.transform.rot);
                    return tempSpatial.pos.data;
                } else {
                    return piece.spatial.pos.data;
                }

            };

            if (this.applies.animate) {

                var spread = this.applies.animate.spread * (Math.random()-0.5) || 0;
                var diffusion = this.applies.animate.diffusion || 0;
                var speed = this.applies.animate.speed || 1;
                var size = this.applies.animate.size || 1;

                var diffuse = function() {
                    return 1 - (Math.random()*diffusion)
                };

                if (this.applies.animate.rotation) {
                    var rot = this.applies.animate.rotation;
                    getRotation = function(particle, tpf) {
                        return particle.rotation + (rot*tpf * (1-spread) + tpf*(1-diffuse()));
                    };
                }


                var pos = [0, 0, 0];

                if (this.applies.animate.oscillate) {

                    var osc = this.applies.animate.oscillate;
                    var time = 0;

                    var posX = function() {
                        return Math.sin(1-spread * time * speed*diffuse())*osc*size;
                    };

                    var posY = function() {
                        return Math.cos(1-spread * time * speed)*diffuse()*osc*size;
                    };

                    getPosition = function(particle, tpf) {

                        time += tpf;

                        //   pos[0] = _this.tempSpatial.rot.data[0];
                        //   pos[1] = _this.tempSpatial.rot.data[1];
//
                        pos[0] = tempSpatial.pos.data[0];
                        pos[1] = tempSpatial.pos.data[1];
                        pos[2] = tempSpatial.pos.data[2];

                        pos[0] = pos[0] + posX() + Math.cos(time*spread+diffuse())*size;
                        pos[1] = pos[1] + posY() + Math.sin(time*spread)*size+diffuse();
                        return pos;
                    };
                }
            };

            var particleUpdate = function(particle, tpf) {
                particle.lifeSpan = piece.temporal.lifeTime;
                particle.position.setArray(getPosition(particle, tpf));
                particle.rotation = getRotation(particle, tpf);
                particle.progress = 0.5 + Math.clamp(piece.spatial.rotVel.data[0]*0.5, -0.49, 0.49);
            };

            this.attachModuleEffect(piece.spatial, applies.game_effect, particleUpdate);
        };

        ModuleEffect.prototype.setupEmitEffectData = function(applies, piece, tempSpatial, transform) {

            this.applies = applies;

            if (!applies.state_factor) applies.state_factor = 1;
            
            var getRotation = function() {
                return -piece.spatial.rot.data[0]+transform.rot[2];
            };

            var getPosition = function() {

                if  (transform) {
                    // _this.readWorldTransform(_this.applies.transform.pos, _this.applies.transform.rot);
                    return tempSpatial.pos.data;
                } else {
                    return piece.spatial.pos.data;
                }

            };
            
            var particleUpdate = function(particle, tpf) {
                particle.lifeSpan = piece.temporal.lifeTime;
                particle.position.setArray(getPosition(particle, tpf));
                particle.rotation = getRotation(particle, tpf);
                particle.progress = 0.5 + Math.clamp(piece.spatial.rotVel.data[0]*0.5, -0.49, 0.49);
            };

        };

        ModuleEffect.prototype.attachModuleEffect = function(spatial, game_effect, particleUpdate) {
            this.gameEffect.attachGameEffect(spatial, game_effect, particleUpdate);
        };

        ModuleEffect.prototype.checkEffect = function(value, key) {
            if (typeof(value) != 'number') {
                console.log("Bad Value", key, effectData[key])
            }
        };

        ModuleEffect.prototype.populateEffectData = function(amplitude) {
            for (var key in this.effectData.params) {
                if (this.effectData.params[key].length) {
                    for (var i = 0; i < this.effectData.params[key].length; i++) {
                        if (key == 'color') {
                            this.effectData.state[key][i] = this.effectData.params[key][i] * MATH.clamp(amplitude, 0, 1);
                        } else {
                            this.effectData.state[key][i] = this.effectData.params[key][i] * amplitude;
                        }
                    }
                } else {
                    this.effectData.state[key] = this.effectData.params[key] * amplitude;
                }

            return;

                var effectData = this.effectData.state;

                for (var key in effectData) {
                    if (effectData[key].length) {
                        for (var i = 0; i < effectData[key].length; i++) {
                            this.checkEffect(effectData[key][i], key)
                        }
                    } else {
                        this.checkEffect(effectData[key], key)
                    }
                }
            }
        };

        ModuleEffect.prototype.updateModuleEffect = function(module, pos, vel) {

            if (this.gameEffect.started) {
                if (this.gameEffect.paused) {
                    this.gameEffect.startGooEffect();
                }
            }

            if (module.state.value > 0 && this.applies.emit_effect) {
                if (typeof(module.state.value) == 'number') {
                    this.populateEffectData(module.state.value);
                } else {
                    var intensity = this.applies.effect_data.intensity || 0.5;
                    this.populateEffectData(Math.random()*intensity);
                }
                
                evt.fire(evt.list().GAME_EFFECT, {effect:this.applies.emit_effect, pos:pos, vel:vel, params:this.effectData.state});
            }
        };



        return ModuleEffect;

    });