webpackJsonp([2],{0:function(a,b,c){a.exports=c(97)},97:function(a,b,c){if(a.exports={Box2DComponent:c(98),Box2DSystem:c(100)},"undefined"!=typeof window)for(var d in a.exports)window.goo[d]=a.exports[d]},98:function(a,b,c){function d(a){e.apply(this,arguments),this.type="Box2DComponent",this.body=null,this.world=null,this.mass=1,f.copyOptions(this,a,{shape:"box",width:1,height:1,radius:1,vertices:[0,1,2,2,0,2],movable:!0,friction:1,restitution:0,offsetX:0,offsetY:0})}var e=c(20),f=c(99);d.prototype=Object.create(e.prototype),d.prototype.constructor=d,a.exports=d},100:function(a,b,c){function d(){f.call(this,"Box2DSystem",["Box2DComponent","MeshDataComponent"]),this.SCALE=.5,this.physicsWorld=new Box2D.b2World(new Box2D.b2Vec2(0,-9.81)),this.velocityIterations=8,this.positionIterations=3}function e(a){for(var b=4,c=new Box2D.b2PolygonShape,d=Box2D.allocate(a.length*b*2,"float",Box2D.ALLOC_STACK),e=0,f=0;f<a.length;f++)Box2D.setValue(d+e,a[f].get_x(),"float"),Box2D.setValue(d+(e+b),a[f].get_y(),"float"),e+=2*b;var g=Box2D.wrapPointer(d,Box2D.b2Vec2);return c.Set(g,a.length),c}var f=c(42);d.prototype=Object.create(f.prototype),d.prototype.constructor=d,d.prototype.inserted=function(a){var b=a.box2DComponent,c=0,d=0,f=new Box2D.b2PolygonShape;if("box"===b.shape)f.SetAsBox(b.width*this.SCALE,b.height*this.SCALE);else if("circle"===b.shape)f=new Box2D.b2CircleShape,f.set_m_radius(b.radius);else if("mesh"===b.shape){for(var g=a.meshDataComponent.meshData,h=g.getAttributeBuffer("POSITION"),i=0,j=[],k=1/0,l=-(1/0),m=1/0,n=-(1/0);i<=h.length-3;){var o=h[i],p=h[++i];k>p&&(k=p),p>l&&(l=p),m>o&&(m=o),o>n&&(n=o),++i;var q=new Box2D.b2Vec2(o,p);j.push(q)}f=e(j),c=l-k,d=n-m}else if("polygon"===b.shape){for(var j=[],i=0;i<=b.vertices.length-2;){var q=new Box2D.b2Vec2(b.vertices[i],b.vertices[++i]);j.push(q),++i}f=e(j)}var r=new Box2D.b2FixtureDef;r.set_shape(f),r.set_density(1),r.set_friction(b.friction),r.set_restitution(b.restitution);var s=new Box2D.b2BodyDef;b.movable===!0&&s.set_type(Box2D.b2_dynamicBody),a.transformComponent.sync(),s.set_position(new Box2D.b2Vec2(a.transformComponent.transform.translation.x+b.offsetX,a.transformComponent.transform.translation.y+b.offsetY));var t=a.transformComponent.transform.rotation.toAngles();s.set_angle(t.z);var u=this.physicsWorld.CreateBody(s);u.CreateFixture(r),u.SetLinearDamping(.95),u.SetAngularDamping(.6),b.body=u,b.world=this.physicsWorld,a.body=u,a.body.h=c,a.body.w=d},d.prototype.deleted=function(a){this.physicsWorld.DestroyBody(a.body)},d.prototype.process=function(a,b){this.physicsWorld.Step(b,this.velocityIterations,this.positionIterations);for(var c=0;c<a.length;c++){var d=a[c],e=d.transformComponent,f=e.transform,g=d.body.GetPosition(),h=g.get_x(),i=g.get_y();f.translation.x=h-d.box2DComponent.offsetX,f.translation.y=i-d.box2DComponent.offsetY,e.setRotation(0,0,d.body.GetAngle()),e.setUpdated()}},a.exports=d}});