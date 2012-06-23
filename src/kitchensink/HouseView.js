goog.provide('nx.HouseView');

goog.require('goog.dom');
goog.require('goog.ui.CustomButton');
goog.require('nx.SampleDragWidget');
goog.require('nx.VerticalScrollView');
goog.require('nx.Widget');
goog.require('nx.SampleWidget');
goog.require('nx.SampleSoyWidget');
goog.require('nx.soy.first');
goog.require('nx.NavigationContent');

/**
 * @param {nx.Widget|Element} parent
 * @constructor
 * @extends {nx.Widget}
 * @implements {nx.View}
 */
nx.HouseView = function (parent) {
    goog.base(this, parent);
    log('HouseView constructor...');
    var ele = goog.dom.createDom('div', {'id':this.getName()});

    this.widget_ = ele;

    var headerDiv = goog.dom.createDom('div', {'class':'navigationBar'});
    headerDiv.innerHTML = '<div>House Title</div>';
    var labelDiv = goog.dom.createDom('div', {'class': 'xlabel Text'});
    var tabBar = goog.dom.createDom('div', {'class':'tabBar'});

    this.add(headerDiv);

    this.labelDiv_ = labelDiv;

//    var dragBtn = new nx.SampleDragWidget(this);
//    this.add(dragBtn);
//
//    var wrappedWidg = new nx.SampleWidget(this);
//    this.add(wrappedWidg);
//
//    var soyWidg = new nx.SampleSoyWidget(this);
//    this.add(soyWidg);

    var navigationContent = new nx.NavigationContent(this);
    this.add(navigationContent);

    var scrollView = new nx.VerticalScrollView(this);
    var textDiv = goog.dom.createDom('div', {'id':'textDiv'});
    textDiv.innerHTML = nx.soy.first.getList();
    scrollView.setWidget(textDiv);
    navigationContent.add(scrollView);

    var button = goog.dom.createDom('div', {'class':'tabContent'}, "House");
    tabBar.appendChild(button);
    goog.events.listen(
        button,
        goog.events.EventType.CLICK,
        this.clickActionButton(), false, this);

    this.add(labelDiv);
    this.add(tabBar);
};
goog.inherits(nx.HouseView, nx.Widget);

/**
 * @inheritDoc
 */
nx.HouseView.prototype.getElement = function () {
    return this.widget_;
};

/**
 * @inheritDoc
 */
nx.HouseView.prototype.setPresenter = function (presenter) {
    this.presenter_ = presenter;
};

/**
 * @inheritDoc
 */
nx.HouseView.prototype.getName = function () {
    return "HouseView";
};

/**
 * @param {nx.House} data
 * @return {Element}
 */
nx.HouseView.prototype.setData = function(data){
    this.labelDiv_.innerHTML = data.getAddress();
};

/**
 * @param {Element} element
 * @param {string} target
 * @return {function(goog.events.Event)}
 */
nx.HouseView.prototype.clickActionButton = function () {
    return function (e) {
        log(e);
        e.stopPropagation();
        this.presenter_.executeClick();
    };
};


goog.exportSymbol('nx.HouseView', nx.HouseView);

