var MyLayer = cc.Layer.extend({
  helloLabel:null,
  sprite:null,

  init:function () {

    this._super();

    var size = cc.director.getWinSize();

    cc.MenuItemFont.setFontSize(30);
    cc.MenuItemFont.setFontName("Impact");
    var closeItem = new cc.MenuItemFont.create(
      "Game Start !",
      function () {
        var scene = new PhyTestScene();
        cc.director.runScene(scene);
      },this);
    closeItem.setAnchorPoint(0.5, 0.5);

    var menu = new cc.Menu(closeItem);
    menu.setPosition(0, 0);
    this.addChild(menu, 1);
    closeItem.setPosition(size.width /2, size.height /2 -50);

    this.helloLabel = new cc.LabelTTF("부케를 던져라!", "Impact", 38);
    this.helloLabel.setPosition(size.width / 2, size.height /2  + 40);
    this.addChild(this.helloLabel, 5);

    // this.sprite = new cc.Sprite(s_HelloWorld);
    // this.sprite.setAnchorPoint(0.5, 0.5);
    // this.sprite.setPosition(size.width / 2, size.height / 2);
    // this.sprite.setScale(size.height / this.sprite.getContentSize().height);
    // this.addChild(this.sprite, 0);
  }
});

var MyScene = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var layer = new MyLayer();
    this.addChild(layer);
    layer.init();
  }
});
