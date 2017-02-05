"use strict";


define([
    '3d/GooController',
    '3d/GooEntityFactory',
    '3d/effects/ParticlePlayer',
    '3d/effects/GooCameraEffects',
    '3d/effects/SpaceFX',
    '3d/effects/GroundFX',
    '3d/models/ModelLoader',
    'Events'

], function(
    GooController,
    GooEntityFactory,
    ParticlePlayer,
    GooCameraEffects,
    SpaceFX,
    GroundFX,
    ModelLoader,
    evt
) {
    
    var world;
    var gooController;
    var particlePlayer;
    var spaceFX;
    var groundFX;
    var modelLoader;

    new GooCameraEffects();
    
    var SceneController = function() {
        gooController = new GooController();
        spaceFX = new SpaceFX();
        groundFX = new GroundFX();
        function rendererReady(e) {
            GooEntityFactory.setGoo(evt.args(e).goo);
            world = evt.args(e).goo.world;
            particlePlayer = new ParticlePlayer(evt.args(e).goo);
            modelLoader = new ModelLoader(evt.args(e).goo);
    //        evt.removeListener(evt.list().ENGINE_READY, rendererReady);
        }

        function drawReady() {
            gooController.registerGooUpdateCallback(particlePlayer.simpleParticles.update);
            tickListen();
    //        evt.removeListener(evt.list().PARTICLES_READY, drawReady);
        }

        function bundlesReady(e) {
            console.log("BUNDLES_READY,", evt.args(e));
        }



        evt.once(evt.list().ENGINE_READY, rendererReady);
        evt.once(evt.list().PARTICLES_READY, drawReady);
        evt.once(evt.list().BUNDLES_READY, bundlesReady);
    };


    function tickListen() {

        spaceFX.setupSpaceFxScene();
        groundFX.setupGroundFxScene();
    }
    
    

    SceneController.prototype.setup3dScene = function(clientTickCallback) {
        gooController.setupGooRunner(clientTickCallback);
    };

    
    return SceneController;

});