webpackJsonp([0],{0:function(a,b,c){a.exports=c(1)},1:function(a,b,c){if(a.exports={AmmoComponent:c(2),AmmoSystem:c(58),calculateTriangleMeshShape:c(26)},"undefined"!=typeof window)for(var d in a.exports)window.goo[d]=a.exports[d]},2:function(a,b,c){function d(a){f.apply(this,arguments),this.settings=a=a||{},p.defaults(a,{mass:0,useBounds:!1,useWorldBounds:!1,useWorldTransform:!1,linearFactor:new Ammo.btVector3(1,1,1),isTrigger:!1,onInitializeBody:null,scale:null,translation:null,rotation:null}),this.mass=a.mass,this.useBounds=a.useBounds,this.useWorldBounds=a.useWorldBounds,this.useWorldTransform=a.useWorldTransform,this.linearFactor=a.linearFactor,this.onInitializeBody=a.onInitializeBody,this.isTrigger=a.isTrigger,this.scale=a.scale,this.translation=a.translation,this.rotation=a.rotation,this.type="AmmoComponent",this.ammoTransform=new Ammo.btTransform,this.gooQuaternion=new g,this.shape=void 0}var e=c(3),f=c(20),g=c(23),h=c(26),i=c(27),j=c(28),k=c(29),l=c(30),m=c(46),n=c(7),o=c(13),p=c(6);d.prototype=Object.create(f.prototype),d.prototype.constructor=d,d.prototype.getAmmoShapefromGooShape=function(a,b){var c,d=[Math.abs(b.scale.x),Math.abs(b.scale.y),Math.abs(b.scale.z)];if(this.scale&&(d=[Math.abs(this.scale.x),Math.abs(this.scale.y),Math.abs(this.scale.z)]),a.meshDataComponent&&a.meshDataComponent.meshData){var e=a.meshDataComponent.meshData;if(e instanceof i)c=new Ammo.btBoxShape(new Ammo.btVector3(e.xExtent*d[0],e.yExtent*d[1],e.zExtent*d[2]));else if(e instanceof k)c=new Ammo.btSphereShape(e.radius*d[0]);else if(e instanceof j)c=new Ammo.btBoxShape(new Ammo.btVector3(e.xExtent,e.yExtent,.01));else if(this.useBounds||this.mass>0){a.meshDataComponent.computeBoundFromPoints();var f=a.meshDataComponent.modelBound;f instanceof n?c=new Ammo.btBoxShape(new Ammo.btVector3(f.xExtent*d[0],f.yExtent*d[1],f.zExtent*d[2])):f instanceof o&&(c=new Ammo.btSphereShape(f.radius*d[0]))}else c=h(a,d)}else for(var c=new Ammo.btCompoundShape,g=a.transformComponent.children,l=0;l<g.length;l++){var m=this.getAmmoShapefromGooShape(g[l].entity,b),p=new Ammo.btTransform;p.setIdentity();var q=g[l].transform.translation;p.setOrigin(new Ammo.btVector3(q.x,q.y,q.z)),c.addChildShape(p,m)}return c},d.prototype.getAmmoShapefromGooShapeWorldBounds=function(a){var b,c=e.getTotalBoundingBox(a);return this.center=c.center,b=new Ammo.btBoxShape(new Ammo.btVector3(c.xExtent,c.yExtent,c.zExtent))},d.prototype.initialize=function(a){var b=a.transformComponent.transform;this.useWorldTransform&&(b=a.transformComponent.sync().worldTransform);var c=this.translation||b.translation,d=this.rotation||b.rotation,e=new Ammo.btTransform;e.setIdentity(),e.setOrigin(new Ammo.btVector3(c.x,c.y,c.z)),this.gooQuaternion.fromRotationMatrix(d);var f=this.gooQuaternion;if(e.setRotation(new Ammo.btQuaternion(f.x,f.y,f.z,f.w)),this.useWorldBounds?(a._world.process(),this.shape=this.getAmmoShapefromGooShapeWorldBounds(a,b),this.difference=this.center.clone().sub(b.translation).negate()):this.shape=this.getAmmoShapefromGooShape(a,b),!1===this.isTrigger){var g=new Ammo.btDefaultMotionState(e),h=new Ammo.btVector3(0,0,0);0!==this.mass&&this.shape.calculateLocalInertia(this.mass,h);var i=new Ammo.btRigidBodyConstructionInfo(this.mass,g,this.shape,h);this.localInertia=h,this.body=new Ammo.btRigidBody(i),this.body.setLinearFactor(this.linearFactor),this.onInitializeBody&&this.onInitializeBody(this.body)}},d.prototype.showBounds=function(a){var b,c=e.getTotalBoundingBox(a),d=new l(m.simpleLit);d.wireframe=!0,c.xExtent?b=a._world.createEntity(new i(2*c.xExtent,2*c.yExtent,2*c.zExtent),d):c.radius&&(b=a._world.createEntity(new k(12,12,c.radius),d)),b.transformComponent.setTranslation(c.center),b.addToWorld(),this.bv=b},d.prototype.setPhysicalTransform=function(a){var b=a.translation;this.ammoTransform.setIdentity(),this.ammoTransform.setOrigin(new Ammo.btVector3(b.x,b.y,b.z)),this.gooQuaternion.fromRotationMatrix(a.rotation);var c=this.gooQuaternion;this.ammoTransform.setRotation(new Ammo.btQuaternion(c.x,c.y,c.z,c.w)),this.body.setWorldTransform(this.ammoTransform)},d.prototype.copyPhysicalTransformToVisual=function(a){var b=a.transformComponent;if(this.body){this.body.getMotionState().getWorldTransform(this.ammoTransform);var c=this.ammoTransform.getRotation();this.gooQuaternion.setDirect(c.x(),c.y(),c.z(),c.w()),b.transform.rotation.copyQuaternion(this.gooQuaternion);var d=this.ammoTransform.getOrigin();b.setTranslation(d.x(),d.y(),d.z()),this.settings.showBounds&&(this.bv||this.showBounds(a),this.bv.transformComponent.transform.rotation.copy(b.transform.rotation),this.bv.transformComponent.setTranslation(b.transform.translation)),this.difference&&b.addTranslation(this.difference)}},a.exports=d},26:function(a,b){a.exports=function(a,b){b=b||[1,1,1];for(var c=4,d=!0,e=d?4:2,f=d?"i32":"i16",g=a.meshDataComponent.meshData,h=g.dataViews.POSITION,i=Ammo.allocate(c*h.length,"float",Ammo.ALLOC_NORMAL),j=0,k=h.length;k>j;j++)Ammo.setValue(i+j*c,b[j%3]*h[j],"float");for(var l=g.indexData.data,m=Ammo.allocate(e*l.length,f,Ammo.ALLOC_NORMAL),j=0,k=l.length;k>j;j++)Ammo.setValue(m+j*e,l[j],f);var n=new Ammo.btIndexedMesh;n.set_m_numTriangles(g.indexCount/3),n.set_m_triangleIndexBase(m),n.set_m_triangleIndexStride(3*e),n.set_m_numVertices(g.vertexCount),n.set_m_vertexBase(i),n.set_m_vertexStride(3*c);var o=new Ammo.btTriangleIndexVertexArray;return o.addIndexedMesh(n,2),new Ammo.btBvhTriangleMeshShape(o,!0,!0)}},58:function(a,b,c){function d(a){e.call(this,"AmmoSystem",["AmmoComponent","TransformComponent"]),this.settings=a||{},this.fixedTime=1/(this.settings.stepFrequency||60),this.maxSubSteps=this.settings.maxSubSteps||5;var b=new Ammo.btDefaultCollisionConfiguration,c=new Ammo.btCollisionDispatcher(b),d=new Ammo.btDbvtBroadphase,f=new Ammo.btSequentialImpulseConstraintSolver;this.ammoWorld=new Ammo.btDiscreteDynamicsWorld(c,d,f,b);var g=this.settings.gravity;null==g&&(g=-9.81),this.ammoWorld.setGravity(new Ammo.btVector3(0,g,0))}var e=c(42);d.prototype=Object.create(e.prototype),d.prototype.inserted=function(a){a.ammoComponent?(a.ammoComponent.initialize(a),this.ammoWorld.addRigidBody(a.ammoComponent.body)):console.log("Warning: missing entity.ammoComponent")},d.prototype.deleted=function(a){a.ammoComponent&&this.ammoWorld.removeRigidBody(a.ammoComponent.body)},d.prototype.process=function(a,b){this.ammoWorld.stepSimulation(b,this.maxSubSteps,this.fixedTime);for(var c=0;c<a.length;c++){var d=a[c];d.ammoComponent.mass>0&&d.ammoComponent.copyPhysicalTransformToVisual(d)}},a.exports=d}});