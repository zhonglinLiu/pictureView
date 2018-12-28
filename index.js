(function($){
    function wheel() {
        this.options = {
            playZoom: 1, // 显示图片的缩放比例
            playElement: '#wheel-show', // 显示图片父元素
            barElement: '#wheel-bar', //底部图片列表父元素
            leftElement: '#wheel-left', //向左翻页
            rightElement: '#wheel-right', //向右翻页
            view:'#view', //大图
            moveCallback: null
        }
        this.index = 0
        this.originImgs = [];
    }
    wheel.prototype.init = function(options) {
        this.options = $.extend(this.options,options);
        this.playImage = $(this.options.playElement).find('img')
        this.barElement = $(this.options.barElement);
        this.barBox = this.barElement.parent();
        this.originImgs = $(this.options.barElement).find('img');
        this.render();
        this.event();

    };
    wheel.prototype.render = function() {
        var _this = this
        for(var k = 0;k<this.originImgs.length;k++) {
            var img = new Image();
            img.src = this.originImgs[k].src;
            (function (k,img) {
                            img.onload = function () {
                                _this.originImgs[k].style.height = _this.barBox.height() + 'px' 
                            }
                        })(k,img);
            
        }
        this.show();
    };
    wheel.prototype.event = function() {
        var _this = this;
        this.barElement.children().each(function (index,ele) {
            $(ele).click(function (e) {
                _this.index = index;
                _this.moveTo();
                _this.show();
            })
        })
        $(this.options.leftElement).click(function () {
            _this.prev();
            _this.show();
        })
        $(this.options.rightElement).click(function () {
            _this.next();
            _this.show();
        })
        var view = $(this.options.playElement);
        view.click(function (e) {
            var w = view.width();
            if(e.offsetX > w / 2) {
                _this.next();
            } else {
                _this.prev();
            }
            _this.show();
        })
    };
    wheel.prototype.moveTo = function(e) {
        var left = $(this.originImgs[this.index]).parent().position().left;
        var width = this.barElement.width()/2;
        var offset = this.barElement.scrollLeft();
        if(left < width) {
            offset -= (width - left);
        } else {
            offset += (left - width);
        }
        this.barElement.animate({'scrollLeft':offset});
        this.options.moveCallback && this.options.moveCallback(this.index,this.originImgs);
    };
    wheel.prototype.next = function(e) {
        this.barElement.animate({'scrollLeft':this.barElement.scrollLeft()+$(this.originImgs[this.index]).parent().width()+2});
        if(this.index < this.originImgs.length-1) {
            this.index ++;
        }
        this.options.moveCallback && this.options.moveCallback(this.index,this.originImgs);
    };
    wheel.prototype.prev = function() {
        this.barElement.animate({'scrollLeft':this.barElement.scrollLeft()-$(this.originImgs[this.index]).parent().width()+2});
        if(this.index > 0) {
            this.index --;
        }
        this.options.moveCallback && this.options.moveCallback(this.index,this.originImgs);
    };

    wheel.prototype.thumbActive = function() {
        for(var k=0;k<this.originImgs.length;k++) {
            this.originImgs[k].style.backgroundColor = '#fff';
            if(k == this.index) {
                this.originImgs[k].style.backgroundColor = '#bbb';
            }
        }
    };

    wheel.prototype.show = function() {
        var _this = this
        this.playImage.animate({'opacity':0},function () {
            var img2 = new Image();
            img2.src = $(_this.originImgs[_this.index]).attr('origin-src');
            img2.onload = function () {
                _this.playImage.attr('src',img2.src);
                _this.playImage.fadeIn();
                _this.playImage.animate({
                    'opacity':1,
                    'height':img2.height / _this.options.playZoom,
                    'width': img2.width / _this.options.playZoom
                })
            }
            
        })
        this.thumbActive()
    };
    wheel.prototype.update = function() {
        this.barElement.children().each(function (index,ele) {
            $(ele).unbind();
        })
        $(this.options.leftElement).unbind();
        $(this.options.rightElement).unbind();
        this.init();
    };
    window.Wheel = new wheel;
})($)