score=0;
life=3;
var GameEndingLayer = cc.LayerColor.extend({
  ctor: function(){
    this._super();
    this.init();
  },
  init: function(){
    this._super(cc.color(0,0,0,100));
    var winSize = cc.director.getWinSize();
    var centerPos = cc.p(winSize.width/2, winSize.height/2);
    
    var nameLabel = new cc.LabelTTF("티파니(김윤영)", "Impact", 38);
    nameLabel.setPosition(winSize.width / 2, winSize.height/2 + 95);
    this.addChild(nameLabel, 105);
    
    var endingLabel = new cc.LabelTTF("결축!", "Impact", 38);
    endingLabel.setPosition(winSize.width / 2, winSize.height/2 + 40);
    this.addChild(endingLabel, 105);
    
    var endingLabel2 = new cc.LabelTTF("삼성전자 서초사옥", "Impact", 38);
    endingLabel2.setPosition(winSize.width / 2, winSize.height/2 - 5);
    this.addChild(endingLabel2, 105);
    
    var endingLabel3 = new cc.LabelTTF("15년 7월 25일 토 오후5시", "Impact", 30);
    endingLabel3.setPosition(winSize.width / 2, winSize.height/2 - 50);
    this.addChild(endingLabel3, 105);
  }
});

var GameOverLayer = cc.LayerColor.extend({
  ctor: function(){
    this._super();
    this.init();
  },
  init: function(){
    this._super(cc.color(100,0,0,100));
    var winSize = cc.director.getWinSize();
    var centerPos = cc.p(winSize.width/2, winSize.height/2);
    cc.MenuItemFont.setFontSize(30);
    cc.MenuItemFont.setFontName("Impact");
    var menuItemRestart = new cc.MenuItemFont.create(
      "Game Restart",
      this.onRestart,this);
    var menu = new cc.Menu(menuItemRestart);
    menu.setPosition(centerPos);
    this.addChild(menu,105);
  },
  onRestart:function(sender){
    cc.director.resume();
    score=0;
    life=3;
    cc.director.runScene( new PhyTestScene() );
  }
});

var PhyTestLayer = cc.Layer.extend({
  helloLabel:null,
  sprite:null,
  space:null,
  
  collisionCoinBegin:function(arbiter, space){
    cc.director.pause();
    this.addChild(new GameOverLayer());
  },
  initPhysics:function(){
    this.space = new cp.Space();
    this.space.gravity = cp.v(0,-360);
    this.space.addCollisionHandler(1, 0, this.collisionCoinBegin.bind(this), null, null, null);
  },
  update:function(dt){
    this.space.step(dt);
    this.helloLabel.setString("Score "+score+" Life "+life);
  },
  
  init:function () {

    this._super();

    var that = this;
    var size = cc.director.getWinSize();
    this.initPhysics();
    
    var floor = new cp.SegmentShape(this.space.staticBody, cp.v(-100, 70), cp.v(1000,70),10);
    floor.setElasticity(1);
    floor.setFriction(0);
    this.space.addStaticShape(floor);
    
    var checkCollision = new cp.SegmentShape(this.space.staticBody, cp.v(0, 81), cp.v(1000,81),1);
    checkCollision.setElasticity(1);
    checkCollision.setFriction(0);
    checkCollision.setCollisionType(1);
    this.space.addStaticShape(checkCollision);
    
    var circle = new cc.PhysicsSprite(buque);  // img of buque
    circle.setScale(0.25);
    var contentsize = circle.getContentSize();
    
    var myBody = new cp.Body(100, cp.momentForBox(100, contentsize.width/4, contentsize.height/4));
    myBody.p = cc.p(size.width/2, size.height / 7 *4);
    this.space.addBody(myBody);

    var myShape = new cp.BoxShape(myBody, contentsize.width/4, contentsize.height/4);
    myShape.setElasticity(1);
    myShape.setFriction(0);
    this.space.addShape(myShape);
    myShape.setCollisionType(0);
    
    circle.setBody(myBody);
    
    this.addChild(circle,90);
    
    
    var gamebg = new cc.Sprite(bg);
    gamebg.setAnchorPoint(0.5, 0.5);
    gamebg.setPosition(size.width/2, size.height /2+150);
    gamebg.setScale(1.3);
    this.addChild(gamebg,-400);
    
    
    var target = new cc.Sprite(target_png);  // shadow img of buque
    target.setAnchorPoint(0.5, 0.5);
    target.setPosition(size.width/2, size.height /7 *2);
    //target.setScale(0.5);
    this.addChild(target,80);
    
    this.helloLabel = new cc.LabelTTF("Score "+score+" Life "+life, "Impact", 38);
    this.helloLabel.setPosition(size.width / 2, size.height - 40);
    this.addChild(this.helloLabel, 5);

    
    
    var childrens1=[];
    var childrens2=[];
    for(var i = 0; i<30 ; i ++){
      var sprite_action1 = cc.MoveBy.create(20,cc.p(-3000,0));
      childrens1[i] = new cc.Sprite(bgbg);
      childrens1[i].setAnchorPoint(0,0);
      childrens1[i].setPosition(100*i,100);
      childrens1[i].setScale(0.1);
      childrens1[i].runAction(sprite_action1);
      this.addChild(childrens1[i],-50);
    }
    for(var i = 0; i<40 ; i ++){
      var sprite_action2 = cc.MoveBy.create(20,cc.p(-2100,0));
      childrens2[i] = new cc.Sprite(bgbg);
      childrens2[i].setAnchorPoint(0,0);
      childrens2[i].setPosition(75*i,190);
      childrens2[i].setScale(0.07);
      childrens2[i].runAction(sprite_action2);
      this.addChild(childrens2[i],-88);
    }
    //var debugNode = new cc.PhysicsDebugNode(this.space);
    //debugNode.visible = true;
    //this.addChild(debugNode);
    
    this.scheduleUpdate();
    if(cc.sys.capabilities.hasOwnProperty( 'mouse') || cc.sys.capabilities.hasOwnProperty( 'touches') ){
      cc.eventManager.addListener({
        event:cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan:function(touch,event){
          if(myBody.vy<0){
            var distance = Math.abs((size.height / 7 *2) - myBody.p.y);
            if(distance<50) {
              score +=1;
              if(score>7){
                cc.director.pause();
                that.addChild(new GameEndingLayer(),100);
              }
            } else {
              life-=1;
              if(life<1){
                cc.director.pause();
                that.addChild(new GameOverLayer(),99);//GameOverLayer
              }
            }
            myBody.vy*=-1;
            myBody.vy-=6;
          }
          return true;
        }
      },this);
    }
  }
});

var PhyTestScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PhyTestLayer();
        this.addChild(layer);
        layer.init();
    }
});
