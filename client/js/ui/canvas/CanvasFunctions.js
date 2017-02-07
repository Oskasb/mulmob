"use strict";


define([
        'Events',
        'PipelineAPI',
        'ui/GameScreen',
        'ui/canvas/CanvasRadar',
        'ui/canvas/CanvasInputVector',
        'ui/canvas/CanvasInputDebug',
        'ui/canvas/CanvasTemporalState',
        'ui/canvas/CanvasGraph'
    ],
    function(
        evt,
        PipelineAPI,
        GameScreen,
        CanvasRadar,
        CanvasInputVector,
        CanvasInputDebug,
        CanvasTemporalState,
        CanvasGraph
    ) {

        var pieces;
        var camera;
        var ownPiece;
        var widgetConfigs;

        var CanvasFunctions = function(canvasGuiApi) {

            this.canvasGuiApi = canvasGuiApi;
            this.configs = {};

            pieces = PipelineAPI.readCachedConfigKey('GAME_DATA', 'PIECES');
            camera = PipelineAPI.readCachedConfigKey('GAME_DATA', 'CAMERA');
            
            var setOwnPiece = function(src, data) {
                ownPiece = data.ownPiece;
            };

            var canvasWidgets = function(src, data) {
                widgetConfigs = data;
            };
            
            PipelineAPI.subscribeToCategoryKey('GAME_DATA', 'OWN_PLAYER', setOwnPiece);
            PipelineAPI.subscribeToCategoryKey('canvas', 'widgets', canvasWidgets);
        };


        CanvasFunctions.prototype.setupCallbacks = function(id, conf, callbackNames) {

            this.callbacks = [];

            var configs = conf;
            
            var radarCallback = function(tpf, ctx) {
                CanvasRadar.drawRadarContent(pieces, ctx, camera, configs, widgetConfigs);
            };

            var temporalStateCallback = function(tpf, ctx) {
                if (ownPiece) {
                    CanvasTemporalState.drawTemporal(ownPiece, ctx, camera, configs, widgetConfigs);
                }
            };

            var inputVectorCallback = function(tpf, ctx) {
                if (ownPiece) {
                    CanvasInputVector.drawInputVectors(ownPiece, ctx, camera, configs, widgetConfigs);
                }
            };

            var inputDebugCallback = function(tpf, ctx) {
                if (ownPiece) {
                    CanvasInputDebug.drawInputVectors(ownPiece, ctx, camera, configs, widgetConfigs);
                }
            };
            
            var tpfMonitorCallback = function(tpf, ctx) {

                if (PipelineAPI.readCachedConfigKey('STATUS', 'MON_SERVER')) {
                    
                    CanvasGraph.drawGraph(PipelineAPI.readCachedConfigKey('STATUS', 'SERVER_IDLE'), ctx, widgetConfigs.idleGraph, widgetConfigs.idleGraph.topValue);
                    CanvasGraph.drawGraph(PipelineAPI.readCachedConfigKey('STATUS', 'SERVER_BUSY'), ctx, widgetConfigs.busyGraph, widgetConfigs.busyGraph.topValue);
                    CanvasGraph.drawGraph(PipelineAPI.readCachedConfigKey('STATUS', 'SERVER_PIECES'), ctx, widgetConfigs.piecesGraph, widgetConfigs.piecesGraph.topValue);
                    CanvasGraph.drawGraph(PipelineAPI.readCachedConfigKey('STATUS', 'SERVER_PLAYERS'), ctx, widgetConfigs.playersGraph, widgetConfigs.playersGraph.topValue);
                }

                if (PipelineAPI.readCachedConfigKey('STATUS', 'MON_TRAFFIC')) {
                    CanvasGraph.drawGraph(PipelineAPI.readCachedConfigKey('STATUS', 'SEND_GRAPH'), ctx, widgetConfigs.sendGraph, widgetConfigs.sendGraph.topValue);
                    CanvasGraph.drawGraph(PipelineAPI.readCachedConfigKey('STATUS', 'RECIEVE_GRAPH'), ctx, widgetConfigs.recieveGraph, widgetConfigs.recieveGraph.topValue);
                }


                if (PipelineAPI.readCachedConfigKey('STATUS', 'MON_TPF')) {
                    CanvasGraph.drawGraph(PipelineAPI.readCachedConfigKey('STATUS', 'FPS_GRAPH'), ctx, widgetConfigs.tpfGraph, 1/widgetConfigs.tpfGraph.topValue);
                }
            };

            var canvasGuiApi = this.canvasGuiApi;
            var mouseState;

            var pointerFrustumPos = new goo.Vector3();

            var followPointerCallback = function(tpf, ctx) {
                mouseState = PipelineAPI.readCachedConfigKey('POINTER_STATE', 'mouseState');
                
                if (mouseState.action[0]) {

                    if (!canvasGuiApi.enabled) {
                        canvasGuiApi.toggleGuiEnabled(true);
                    }

                    pointerFrustumPos.setDirect(
                    ((mouseState.x-GameScreen.getLeft()) / GameScreen.getWidth()) - 0.5,
                    ((mouseState.y-GameScreen.getTop()) / GameScreen.getHeight()) - 0.5,
                        0
                    );

                    canvasGuiApi.setElementPosition(

                        pointerFrustumPos.x,
                        pointerFrustumPos.y

                    )

                } else {
                    canvasGuiApi.toggleGuiEnabled(false);
                }
            };


            var fitView = function(vec3) {
                vec3.x *= 1.05 / GameScreen.getAspect();
                vec3.v *= -1.05
            };

            var checkPieceForHover = function(piece) {

                piece.getScreenPosition(frustumCoordinates);
                fitView(frustumCoordinates);

                if (piece.isOwnPlayer) {
                    hoverPiece = piece;
                    hoverCoords.setVector(frustumCoordinates)
                }

            };

            var pieces;
            var hoverPiece;
            var frustumCoordinates = new goo.Vector3(0, 0, 0);
            var hoverCoords = new goo.Vector3(0, 0, 0);

            var hoverTargetsCallback = function(tpf, ctx) {
                mouseState = PipelineAPI.readCachedConfigKey('POINTER_STATE', 'mouseState');

                if (mouseState.action[0]) {

                    if (!canvasGuiApi.enabled) {
                        canvasGuiApi.toggleGuiEnabled(true);
                    }

                    pieces = PipelineAPI.readCachedConfigKey('GAME_DATA', 'PIECES');

                    for (var key in pieces) {
                        checkPieceForHover(pieces[key]);
                    }

                    canvasGuiApi.setElementPosition(
                        hoverCoords.x,
                        hoverCoords.y
                    )

                } else {
                    canvasGuiApi.toggleGuiEnabled(false);
                }

            };


            var canvasCallbacks = {
                radarMap:radarCallback,
                inputVector:inputVectorCallback,
                inputDebug:inputDebugCallback,
                temporalState:temporalStateCallback,
                tpfMonitor:tpfMonitorCallback,
                followPointer:followPointerCallback,
                hoverTargets:hoverTargetsCallback
            };

            for (var i = 0; i < callbackNames.length; i++) {
                this.callbacks.push(canvasCallbacks[callbackNames[i]])
            }

        };

        CanvasFunctions.prototype.callCallbacks = function(tpf, ctx) {
            for (var i = 0; i < this.callbacks.length; i++) {
                this.callbacks[i](tpf, ctx);
            }
        };
        

        return CanvasFunctions;

    });


