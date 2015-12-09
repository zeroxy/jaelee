var TitleLayer = cc.Layer.extend({
  init:function () {

    this._super();

    var size = cc.director.getWinSize();

    cc.MenuItemFont.setFontSize(50);
    cc.MenuItemFont.setFontName("Impact");
    var closeItem = new cc.MenuItemFont.create(
      "Game Start !",
      function () {
        var scene = new GameScene();
        cc.director.runScene(scene);
      },this);
    closeItem.setAnchorPoint(0.5, 0.5);
    closeItem.setPosition(size.width /2, size.height /2 -50);
    
    var menu = new cc.Menu(closeItem);
    menu.setPosition(0, 0);
    this.addChild(menu, 1);
    

    this.gyulhon = new cc.LabelTTF("결혼해라!!", "Impact", 70);
    this.wonjae = new cc.LabelTTF("원재형!!", "Impact", 70);
    this.gyulhon.setPosition(-40 , size.height /2  + 110);
    this.wonjae.setPosition(-80 , size.height /2  + 40);
    
    this.addChild(this.gyulhon, 5);
    this.addChild(this.wonjae, 5);
    
    first_sprite_action = cc.MoveTo.create(1,cc.p(size.width / 2 , size.height /2  + 110));
    second_sprite_action = cc.MoveTo.create(1.5,cc.p(size.width / 2 , size.height /2  + 40));
    
    this.gyulhon.runAction(first_sprite_action);
    this.wonjae.runAction(second_sprite_action);

    var gamebg = cc.Sprite.create(resources, new cc.Rect(290,0,290,512));
    gamebg.setAnchorPoint(0.5, 0.5);
    gamebg.setPosition(size.width /2, size.height/2);
    gamebg.setScale(2.3);
    this.addChild(gamebg,-400);
    
    var wj = cc.Sprite.create(wonjaelee1);
    wj.setAnchorPoint(0.5, 0.5);
    wj.setPosition(size.width /2, size.height/2);
    wj.setScale(0.7);
    this.addChild(wj,-300);
    
  }
});


var TitleScene = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var layer = new TitleLayer();
    this.addChild(layer);
    layer.init();
  }
});
