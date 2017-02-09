
"use strict";


define([
        'Events'
    ],
    function(
        evt
    ) {

        var transform = function(srcTrf) {

            if (srcTrf.pos) {
                this.pos = [srcTrf.pos[0], srcTrf.pos[1], srcTrf.pos[2]];
            }

            if (srcTrf.rot) {
                this.rot = [srcTrf.rot[0], srcTrf.rot[1], srcTrf.rot[2]];
            }

            if (srcTrf.size) {
                this.size = [srcTrf.size[0], srcTrf.size[1], srcTrf.size[2]];
            }

        };



        var AttachmentPoint = function(apData, defaultModule) {
            this.slot = apData.slot;
            if (apData.transform) {
                this.transform = new transform(apData.transform);
            }

            this.data = {module:defaultModule};
        };

        AttachmentPoint.prototype.attachModule = function () {
            
        };

        AttachmentPoint.prototype.sampleModuleFrame = function () {

        };

        AttachmentPoint.prototype.removeClientModule = function () {
            
                        
        };
        
        return AttachmentPoint
    });