function NavSlide( _container, _variable ) {
    this.order = "sIdxTime"//初始化排序类型;
    this.Page = 1;//初始化页数
    this.PageSize = 10;//初始化每页显示多少条
    this.Type = "iKeyword";//初始化搜索类型
    this.TypeId = 0;//初始化搜索类型ID
    this.variable = _variable || true;
    this.totalPage = 1;

    this.container = _container;
    this.slide;
    this.index = 0;
    this.prevIndex = 0;
    this.navLength = $(this.container).find('.slide-nav li').length;

    this.isClick = false;
    this.step = 0;
    
    this.init();
}

NavSlide.prototype = {
    init: function() {
        var self = this;
        var dom = '';
        for(var i = 0; i < self.navLength; i++) {
            dom += '<ul class="strategy_list tab-content hero-intr-vcont c slide-item swiper-slide video-list-' + i + '"></ul>';
        }
        $(self.container).find('.slide-content').html( dom );

        self.initSwiper();

        $(self.container + ' .tab-controller-container').scroll(function() {
            var scrollLeft = $(this).scrollLeft();

            if( scrollLeft == 0 ) {
                $(self.container + ' .slide-nav').css('transform', 'translateX(-' + scrollLeft + 'px)');
            }
        });
    },
    initSwiper: function() {
        var self = this;
        var _container = $(self.container + ' .swiper-container');
        self.slide = new Swiper(_container, {
            noSwiping : true,
            onInit: function(swiper) {
                self.isClick = true;
                $(self.container).find('.swiper-slide-active').addClass('swiper-no-swiping');
                self.index = 0;
                var $item = $(self.container).find('.slide-nav li').eq(self.index);
                $item.addClass('now').siblings().removeClass('now');
                self.TypeId = $item.attr('data-id');
               
                self.loadData();

                $(self.container + ' .tab-controller-container .slide-nav').on('click', 'li', function() {
                    self.isClick = true;
                    self.index = $(this).index();
                    swiper.slideTo(self.index);
                });

                $('.strategy_title').css('-webkit-line-clamp','2');

                $(self.container + ' .swiper-slide-active').scroll(_.throttle(function(e) {
                    e.stopPropagation();
                    var divHeight = $(this).height();
                    var nScrollHeight = $(this)[0].scrollHeight;
                    var nScrollTop = $(this)[0].scrollTop;
                        console.log(self.Page);
                    if(nScrollTop + divHeight + 1 >= nScrollHeight) {
                        if( self.Page <= self.totalPage ) {
                            console.log(11111111);
                            self.loadData();
                        }else {
                            $(this).addClass('allLoad');
                        }
                    }
                }, 500));
            },
            onSlideChangeStart: function(swiper) {
                $(self.container).find('.swiper-slide-active').addClass('swiper-no-swiping');
                self.index = swiper.activeIndex;
                self.prevIndex = swiper.previousIndex;
                self.Page = 1;
                self.totalPage = 1;

                var $navLi = $(self.container).find('.slide-nav li').eq(self.index);
                $navLi.addClass('now').siblings().removeClass('now');
                self.TypeId = $navLi.attr('data-id');
                
                if( $(self.container + ' .slide-content .video-list-' + self.index).html() == '' ) {
                    self.loadData();    
                }else {
                    $(self.container).find('.swiper-slide-active').removeClass('swiper-no-swiping');
                    // if( !self.isClick ) {
                        self.transformNav();
                    // }
                    // self.isClick = false;
                    
                }
                // $(self.container + ' .more-words').text( $navLi.text() );

                $(self.container + ' .swiper-slide-active').scroll(_.throttle(function(e) {
                    e.stopPropagation();
                    var divHeight = $(this).height();
                    var nScrollHeight = $(this)[0].scrollHeight;
                    var nScrollTop = $(this)[0].scrollTop;
                        console.log(self.Page);
                    if(nScrollTop + divHeight + 1 >= nScrollHeight) {
                        if( self.Page <= self.totalPage ) {
                            console.log(11111111);
                            self.loadData();
                        }else {
                            $(this).addClass('allLoad');
                        }
                    }
                }, 500));
            }
        })
    },
    transformNav: function() {
        var self = this;

        var $container = $( self.container + ' .tab-controller-container');
        var containerWidth = $container.width();
        var windowMargin = Math.ceil(($(window).width() - containerWidth) / 2);
        var navWidth = $( self.container + ' .slide-nav').width();
        var $list =  $( self.container + ' .tab-controller li');
        
        var $curItem = $list.eq(self.index),
            curOffsetLeft = $curItem.get(0).offsetLeft;
        
        var scrollLeft = $container.scrollLeft();
        

        var previousWidth = 0;
      
        var diff = curOffsetLeft - scrollLeft;
        var inWindow = diff > 0 && diff < containerWidth ? true : false;
        var curWidth = parseInt($curItem.width()) + parseInt($curItem.css('padding-right')) + parseInt($curItem.css('padding-left'));

        if( !inWindow ) {
            if( diff < 0 ) {
                $container.animate({scrollLeft: curOffsetLeft - windowMargin + 'px'}, 200);
            }else if( diff > containerWidth ) {
                $container.animate({scrollLeft: curOffsetLeft - containerWidth + curWidth + 'px'}, 200);
            }
        }
    },
    loadData: function() {
        var self = this;
     
        if( self.TypeId == 677 ) {
            self.Type = 'iType';
        }else if( self.TypeId == 'item1' || self.TypeId == 'item2' ) {
            self.getColumNewest();
            return;
        }else {
            self.Type = 'iKeyword';
        }
        QuerySearchList(self.Page,self.PageSize,self.order,self.Type,self.TypeId,function(data){
			if(data.status == 0){
                self.totalPage = data.msg.totalpage;
                if( self.Page == 1 ) {
                    console.log($(self.container + ' .slide-content .video-list-' + self.index));
	                $(self.container + ' .slide-content .video-list-' + self.index).html(self.pushData(data['msg']['result'],self.PageSize,'videosearch'+self.Type,self.TypeId));
                    $(self.container + ' .swiper-slide-active').addClass('init');
                }else {
                    $(self.container + ' .slide-content .video-list-' + self.index).append(self.pushData(data['msg']['result'],self.PageSize,'videosearch'+self.Type,self.TypeId));
                }
                $(self.container + ' .swiper-slide-active').removeClass('swiper-no-swiping');
                self.transformNav();
                
                if( self.Page == data.msg.totalpage ) {
                    $(self.container + ' .swiper-slide-active').addClass('allLoad');
                }
                self.Page++;
	        }else{
	        	$(self.container + ' .slide-content .video-list-' + self.index).html(data.msg);
	        }
		}); 
    },
    getColumNewest: function() {
        var compareTime = function(a) {
            return parseInt(new Date(Date.parse(a.replace(/-/g,"/"))).getTime());
        };

        var self = this;
        var items = {} || [];

		if( self.TypeId == 'item1' ) {
            items = [2132, 2499, 2137, 2140, 1274, 2500, 2131, 2501, 2502, 2503, 2504, 2512, 2506];
		}else {
			items = [2507, 2508, 2132, 2509, 2135, 2510, 2504, 2511, 2512];
		}
        var maxPage = 1;
        var retNHTML = '';
		var arr = [],
			index = 0;
		for(var i = 0; i < items.length; i++) {
			QuerySearchList(self.Page, self.PageSize, 'sIdxTime', 'iKeyword', items[i], function(data) {
				if(data.status == 0) {
                    var total = parseInt(data.msg.totalpage);
                    self.totalPage = total;

					var dataArr = data.msg.result;
					for(var j = 0; j < dataArr.length; j++) {
						arr.push(dataArr[j]);
					}

					if(index == items.length-1) {
						arr = arr.sort(function(a, b) {
							return compareTime(b.sCreated) - compareTime(a.sCreated);
						});
						var newData = arr.slice(0, 8);
                   
                        if( self.Page == 1 ) {
                            $(self.container + ' .slide-content .video-list-' + self.index).html(self.pushData(newData, self.PageSize));
                            $(self.container + ' .swiper-slide-active').addClass('init');
                        }else {
                            $(self.container + ' .slide-content .video-list-' + self.index).append(self.pushData(newData, self.PageSize));
                        }
                        $(self.container + ' .swiper-slide-active').removeClass('swiper-no-swiping');
                        // if( !self.isClick ) {
                            self.transformNav();
                        // }
                        // self.isClick = false;
                        if( self.totalPage == data.msg.page ) {
                            $(self.container + ' .swiper-slide-active').addClass('allLoad');
                        }
                        self.Page++;
					}
					index++;

				} else {
				}
			});
		}
    },
    pushData: function(data,num,str,iType) {
        var RetHTML = '';
        var length = data.length > num ? num : data.length;
        for(var x=0;x<length;x++){
            RetHTML += '<li class="li">';
            // RetHTML += '<p class="v_pic hero-intr-play" href="'+data[x]['sUrl']+'" onclick="'+data[x]['sLog']+'" target="_blank" title="'+data[x]['sTitle']+'">';
            RetHTML += '<a href="//pvp.qq.com/m/m201606/' + data[x]['sUrl'] + '" class="strategy_pic hero-intr-vimg"><img src="'+data[x]['sIMG']+'" alt="'+data[x]['sTitle']+'"><span></span></a>';
            RetHTML += '<div class="strategy_cont"><a href="//pvp.qq.com/m/m201606/' + data[x]['sUrl'] + '">';
            RetHTML += '<span class="strategy_title">'+data[x]['sTitle']+'</span>';
            // RetHTML += '<span class="strategy_desc">'+data[x]['sDesc']+'</span>';
            RetHTML += '<div class="hero-intr-info c">';
            RetHTML += '<span class="v_num hot-video-spr hot-video-fre">'+data[x]['iTotalPlay']+'</span>';
            RetHTML += '<span class="v_num hot-video-spr hot-video-tm">'+data[x]['iTime']+'</span>';
            RetHTML += '<span class="strategy_time">'+ReloadPubdate(data[x]['sCreated'])+'</span></div></div></a></li>';
        }
        return RetHTML;
    }
}