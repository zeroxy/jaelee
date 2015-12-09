score = 0;
var GameOverLayer = cc.LayerColor.extend({
  ctor: function(){
    this._super();
    this.init();
  },
  init: function(){
    this._super(cc.color(100,0,0,100));
    var winSize = cc.director.getWinSize();
    var centerPos = cc.p(winSize.width/2, winSize.height/2-30);
    
    var wonjae = new cc.LabelTTF("G A M E   O V E R !", "Impact", 70);
    wonjae.setPosition(winSize.width/2 , winSize.height /2  + 40);
    this.addChild(wonjae);
    
    var lastscore = new cc.LabelTTF("점수 : " +score, "Impact", 70);
    lastscore.setPosition(winSize.width/2 , winSize.height /2  + 140);
    this.addChild(lastscore);
    
    
    cc.MenuItemFont.setFontSize(30);
    cc.MenuItemFont.setFontName("Impact");
    var menuItemRestart = new cc.MenuItemFont.create(
      "TOUCH HERE!! Game Restart",
      this.onRestart,this);
    var menu = new cc.Menu(menuItemRestart);
    menu.setPosition(centerPos);
    this.addChild(menu,105);
  },
  onRestart:function(sender){
    cc.director.resume();
    score=0;
    var gameScene = new GameScene();
    cc.director.runScene( gameScene );
  }
});

var GameLayer = cc.Layer.extend({
  helloLabel:null,
  sprite:null,
  space:null,
  
  collisionFloor:function(arbiter, space){

    cc.director.pause();
    this.addChild(new GameOverLayer());
  },
  initPhysics:function(){
    this.space = new cp.Space();
    this.space.gravity = cp.v(0,-960);
    this.space.addCollisionHandler(1, 0, this.collisionFloor.bind(this), null, null, null);

  },
  update:function(dt){
    this.space.step(dt);
    if (this.gamebg1.getPosition().x <= (-280*3) ){
      this.gamebg1.setPosition(3*280 , 0);
    }
    if (this.gamebg2.getPosition().x <= (-280*3) ){
      this.gamebg2.setPosition(3*280 , 0);
    }
    if (this.upperBlock.getPosition().x <= -51*3){
      score += 1;
      var blockHigh= 500+(Math.random()*400)
      this.upperBlock.setPosition(cc.director.getWinSize().width, blockHigh);
      this.lowerBlock.setPosition(cc.director.getWinSize().width, blockHigh-400);
    }
    var upperblockCollision = cc.rectOverlapsRect(this.wonjaelee.getBoundingBox(), this.upperBlock.getBoundingBox());
    var lowerblockCollision = cc.rectOverlapsRect(this.wonjaelee.getBoundingBox(), this.lowerBlock.getBoundingBox());
    
    if(upperblockCollision || lowerblockCollision){
      cc.director.pause();
      this.init();
      this.addChild(new GameOverLayer());
      
    }
  },
  
  init:function () {

    
    this._super();

    var size = cc.director.getWinSize();
    
    this.initPhysics();
    
    //var debugNode = new cc.PhysicsDebugNode(this.space);
    //debugNode.visible = true;
    //this.addChild(debugNode);
    
    var texture1 = cc.textureCache.addImage(wonjaelee1);
    var texture2 = cc.textureCache.addImage(wonjaelee2);
    var texture3 = cc.textureCache.addImage(wonjaelee3);

    var wonjaeFrames = [];
    wonjaeFrames.push( cc.SpriteFrame.create(texture1, cc.rect(0,0,1251,1808)) );
    wonjaeFrames.push( cc.SpriteFrame.create(texture2, cc.rect(0,0,1251,1808)) );
    wonjaeFrames.push( cc.SpriteFrame.create(texture1, cc.rect(0,0,1251,1808)) );
    wonjaeFrames.push( cc.SpriteFrame.create(texture3, cc.rect(0,0,1251,1808)) );
    
    var animation = cc.Animation.create (wonjaeFrames, 0.07);
    
    var runningAction = cc.RepeatForever.create(cc.Animate.create(animation));
    
    
    this.wonjaelee = new cc.PhysicsSprite(wonjaelee2);
    this.wonjaelee.setAnchorPoint(0.5, 0.5);
    this.wonjaelee.setScale(0.13);
    this.wonjaelee.runAction(runningAction);
    
    var contentsize = this.wonjaelee.getContentSize();
    
    
    var myBody = new cp.Body(10, cp.momentForBox(10, contentsize.width*0.13, contentsize.height*0.13));
    myBody.p = cc.p(size.width/5, size.height/2);
    this.space.addBody(myBody);
    var myShape = new cp.BoxShape(myBody, contentsize.width*0.13, contentsize.height*0.13);
    myShape.setElasticity(1);
    myShape.setFriction(0);
    this.space.addShape(myShape);
    myShape.setCollisionType(0);
    this.wonjaelee.setBody(myBody);
    
    this.addChild(this.wonjaelee,90);

    
    
    var scale = 3
    var bg1move = cc.MoveBy.create(4, cc.p(-287* scale*2,0));
    var bg2move = cc.MoveBy.create(4, cc.p(-287* scale*2,0));
    var bg1seq = cc.RepeatForever.create(bg1move);
    var bg2seq = cc.RepeatForever.create(bg2move);
    
    this.gamebg1 = cc.Sprite.create(resources, new cc.Rect(292,0,287,511));
    this.gamebg1.setAnchorPoint(0, 0.2);
    this.gamebg1.setPosition(0, 0);
    this.gamebg1.setScale(scale);
    this.addChild(this.gamebg1,-400);
    
    
    this.gamebg2 = cc.Sprite.create(resources, new cc.Rect(292,0,287,511));
    this.gamebg2.setAnchorPoint(0, 0.2);
    this.gamebg2.setPosition(scale*286, 0);
    this.gamebg2.setScale(scale);
    this.addChild(this.gamebg2,-400);

    this.gamebg1.runAction(bg1seq);
    this.gamebg2.runAction(bg2seq);
    
    var floor = new cp.SegmentShape(this.space.staticBody, cp.v(-200, 10), cp.v(1500,10),5);
    floor.setElasticity(1);
    floor.setFriction(0);
    floor.setCollisionType(1);
    this.space.addStaticShape(floor);
    
    var ceil = new cp.SegmentShape(this.space.staticBody, cp.v(-200, size.height), cp.v(1500,size.height),5);
    ceil.setElasticity(1);
    ceil.setFriction(0);
    ceil.setCollisionType(1);
    this.space.addStaticShape(ceil);
    
    var checkfloor = new cp.SegmentShape(this.space.staticBody, cp.v(-200, 9), cp.v(1500,9),5);
    checkfloor.setElasticity(1);
    checkfloor.setFriction(0);
    this.space.addStaticShape(checkfloor);
    
    
    var upperblockmove = cc.RepeatForever.create(cc.MoveBy.create(4, cc.p(size.width*-2,0)));
    var lowerblockmove = cc.RepeatForever.create(cc.MoveBy.create(4, cc.p(size.width*-2,0)));
    
    this.upperBlock = cc.Sprite.create(resources, new cc.Rect(112,646,51,319));
    this.upperBlock.setAnchorPoint(0,0);
    this.upperBlock.setScale(3);
    this.upperBlock.setPosition(size.width - 40, 600);
    this.addChild(this.upperBlock);
    
    
    this.lowerBlock = cc.Sprite.create(resources, new cc.Rect(0,646,51,319));
    this.lowerBlock.setAnchorPoint(0,1);
    this.lowerBlock.setScale(3);
    this.lowerBlock.setPosition(size.width - 40, 200);
    this.addChild(this.lowerBlock);
    
    this.lowerBlock.runAction(lowerblockmove);
    this.upperBlock.runAction(upperblockmove);

    this.scheduleUpdate();
    
    if(cc.sys.capabilities.hasOwnProperty( 'mouse') || cc.sys.capabilities.hasOwnProperty( 'touches') ){
      cc.eventManager.addListener({
        event:cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan:function(touch,event){
          myBody.vy = 390;
          return true;
        }
      },this);
    }
    
    return true;
  }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var gameLayer = new GameLayer();
        this.addChild(gameLayer);
        gameLayer.init();
    }
});
