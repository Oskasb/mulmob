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


        var ModuleModel = function (parentEntity) {
            this.parentEntity = parentEntity;
            this.moduleEntity;
            this.entityName;
            this.baseRotation = new goo.Vector3();
        };

        ModuleModel.prototype.attachModuleModel = function (modelName) {
            evt.fire(evt.list().ATTACH_BUNDLE_ENTITY, {entityName: modelName, parent: this.parentEntity});
        };


        ModuleModel.prototype.attachEntityToModule = function(childEntityName) {
            this.entityName = childEntityName;
            var e = this.parentEntity;


            var checkName = function(entity) {
                console.log(entity.name, childEntityName);
                if (entity.name == childEntityName) {
                    e = entity;
                    return true;
                }
            };


            this.parentEntity.traverse(checkName);

            this.moduleEntity = e;

            this.parentEntity.transformComponent.transform.rotation.toAngles(this.baseRotation);
            console.log("Module Entity", this.moduleEntity, this.baseRotation);

        };

        ModuleModel.prototype.applyModuleRotation = function(rot) {

            if (this.moduleEntity.name != this.entityName) {
                this.attachEntityToModule(this.entityName)
            }

            this.moduleEntity.transformComponent.transform.rotation.fromAngles(rot[0] - this.baseRotation.x, rot[1] - this.baseRotation.y, rot[2] - this.baseRotation.z);
            this.moduleEntity.transformComponent.setUpdated();
        };


        return ModuleModel;
        
    });