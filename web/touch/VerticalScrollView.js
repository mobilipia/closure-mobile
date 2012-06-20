goog.provide('nx.VerticalScrollView');

goog.require('nx.DragController');
goog.require('nx.Fx');
goog.require('nx.Util');

/**
 * @param {number} x
 * @param {number} y
 * @implements {nx.DragEventsHandler}
 * @implements {nx.SwipeEventsHandler}
 * @constructor
 */
nx.VerticalScrollView = function (x, y) {
    this.hasTextBox_ = false;
    this.widgetElement_ = undefined;
    this.panelHeight_ = -1;
    this.widgetHeight_ = -1;
    this.panel_ = goog.dom.createDom('div', {'class':'scrollPanel'});

    nx.DragController.getInstance().addDragEventsHandler(this);
    nx.DragController.getInstance().addSwipeEventsHandler(this);
};

//////////////////

nx.VerticalScrollView.prototype.add = function (widget) {
    this.widgetElement_ = widget;
    goog.dom.appendChild(this.panel_, widget);
};

nx.VerticalScrollView.prototype.clear = function () {
    goog.dom.removeChildren(this.panel_);
};

//public Element getParentContainer() {
//    return (Element)RootLayoutPanel.get().getWidgetContainerElement(this);
//}

//public Iterator<Widget>
//nx.VerticalScrollView.prototype.iterator = function() {
//    return this.panel_.iterator();
//};

//public boolean
nx.VerticalScrollView.prototype.remove = function (widget) {
//    return this.panel_.remove(w);
    goog.dom.removeNode(widget);
};


nx.VerticalScrollView.prototype.setScrollPositionY = function (pos) {
    if (this.hasTextBox_) {
        nx.Fx.setStyleTop(this, pos);
    } else {
        nx.Fx.setTranslateY(this.el(), pos);
    }
};

nx.VerticalScrollView.prototype.getScrollPositionY = function () {
    if (this.hasTextBox_) {
        return nx.Fx.getStyleTop(this);
    } else {
        return nx.Fx.getTranslateY(this.el());
    }
};

nx.VerticalScrollView.prototype.getScrollToPositionY = function () {
    if (this.hasTextBox_) {
        return nx.Fx.getStyleTop(this);
    } else {
        return nx.Fx.getMatrixY(this.el());
    }
};


nx.VerticalScrollView.prototype.el = function() {
//    if (widgetElement_ == null) {
//        widgetElement_ = getWidget().getElement();
//    }
    return this.widgetElement_;
};

nx.VerticalScrollView.prototype.lazyInit = function() {
    // lazy init. no reason to calculate each time in onDragMove
    // if (panelHeight_ < 1) {
    this.panelHeight_ = nx.Fx.getHeight(this.getElement());
    // }
    // if (widgetHeight_ < 1) {
    this.widgetHeight_ = nx.getOffsetHeight(this.widgetElement_);
    // }
};


//////////////////////
/**
 * @inheritDoc
 */
nx.VerticalScrollView.prototype.getElement = function () {
    return this.panel_;
};

/**
 * @inheritDoc
 */
nx.VerticalScrollView.prototype.onDragStart = function (e) {
    log('[[[[ VerticalScrollView ]]]] onDragStart', e);

    this.lazyInit();

    var matrixY = this.getScrollToPositionY();
    var currY = this.getScrollPositionY();
    nx.Fx.setTransitionDuration(this.el(), 0);
    if (currY != matrixY) {
        // scroll on going
        var diffY = currY - matrixY;
        var offsetY = diffY > 2 ? 2 : diffY > -2 ? diffY : -2;
        this.setScrollPositionY(matrixY + offsetY);
        nx.DragController.getInstance().suppressNextClick();
    }
};

/**
 * @inheritDoc
 */
nx.VerticalScrollView.prototype.onDragMove = function (e) {
//    log('[[[[ VerticalScrollView ]]]] onDragMove', e);
    var currY = this.getScrollPositionY();
    if (currY > 0) {
        // exceed top boundary
        if (e.OffsetY > 0) {
            // resist scroll down.
            currY += e.OffsetY / 2;
            // need the cast for production mode.
        } else {
            currY += e.OffsetY * 2;
        }
    } else if (-currY + this.panelHeight_ > this.widgetHeight_) {
        // exceed bottom boundary
        if (e.OffsetY < 0) {
            // resist scroll up.
            currY += e.OffsetY / 2;
        } else {
            currY += e.OffsetY * 2;
        }
    } else {
        currY += e.OffsetY;
    }
    this.setScrollPositionY(currY);
};
/**
 * @inheritDoc
 */
nx.VerticalScrollView.prototype.onDragMoveHorizontal = function (e) {
//    log('[[[[ VerticalScrollView ]]]] onDragMoveHorizontal', e);
};
/**
 * @inheritDoc
 */
nx.VerticalScrollView.prototype.onDragMoveVertical = function (e) {
//    log('[[[[ VerticalScrollView ]]]] onDragMoveVertical', e);
};

/**
 * @inheritDoc
 */
nx.VerticalScrollView.prototype.onDragEnd = function (e) {
    log('[[[[ VerticalScrollView ]]]] onDragEnd', e);
    var currY = this.getScrollPositionY();
    if (currY == 0) {
        return;
    }

//		FxUtil.setTransitionTiming(el());
    // exceed top boundary
    if (currY > 0 || this.panelHeight_ > this.widgetHeight_) {
        nx.Fx.setTransitionDuration(this.el(), 500);
        this.setScrollPositionY(0);
    } else if (-currY + this.panelHeight_ > this.widgetHeight_) {
        // exceed bottom boundary
        nx.Fx.setTransitionDuration(this.el(), 500);
        this.setScrollPositionY(this.panelHeight_ - this.widgetHeight_);
    }
//		FxUtil.debug(el());
};

/**
* @param {nx.SwipeEvent} e
*/
nx.VerticalScrollView.prototype.onSwipeVertical = function (e) {
    log('[[[[ VerticalScrollView ]]]] onSwipeHorizontal', e);
    var currY = this.getScrollPositionY();
    // exceed top boundary
    if ((currY >= 0) || (-currY + this.panelHeight_ >= this.widgetHeight_)) {
        // exceed bottom boundary
        return;
    }

    var speed = e.getSpeed();
    var timeFactor = 2800;
    var time = Math.abs(speed * timeFactor);
    var dicstanceFactor = 0.24;
    var distance = (speed * time * dicstanceFactor);
    // Utils.Console("speed " + speed + " time " + time + " distance " +
    // distance + " current " + current);
    currY += distance;
    if (currY > 0) {
        // exceed top boundary
        var timeAdj = 1 - currY / distance;
        time = time * timeAdj;
        currY = 0;
    } else if (-currY + this.panelHeight_ > this.widgetHeight_) {
        // exceed bottom boundary
        var bottom = this.panelHeight_ - this.widgetHeight_;
        var timeAdj = 1 - (currY - bottom) / distance;
        time = time * timeAdj;
        currY = bottom;
    }
    nx.Fx.setTransitionDuration(this.el(), time);
    this.setScrollPositionY(currY);
};

/**
* @param {nx.SwipeEvent} e
*/
nx.VerticalScrollView.prototype.onSwipeHorizontal = function (e) {
    log('[[[[ VerticalScrollView ]]]] onSwipeHorizontal', e);
};