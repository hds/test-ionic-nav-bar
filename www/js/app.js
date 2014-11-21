// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        // controller: 'AppCtrl as app',
        templateUrl: "templates/main.html"
    })

    .state('app.playlist-list', {
      url: "/playlists",
      views: {
        'main-view' :{
          templateUrl: "templates/playlists.html"
        }
      }
    })

    .state('app.playlist-detail', {
        url: "/playlists/:playlist_id",
        // templateUrl: "templates/playlist.html"
        views: {
            'main-view' :{
                controller: 'PlaylistDetailCtrl as ctrl',
                templateUrl: "templates/playlist.html"
            }
        }
    });

    $urlRouterProvider.otherwise('/app/playlists');

});

app.controller('AppCtrl', function($scope) {
    var self = this;

    console.log('Well, we\'re here.')
    self.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
    ];

    self.search = false;
    self.toggle_search = function()  {
        self.search = ! self.search;
    }
});

app.controller('PlaylistDetailCtrl', function($stateParams) {
    var self = this;

    self.playlist_id = $stateParams.playlist_id;
});

app.controller('$fpNavBar', [
    '$scope',
    '$element',
    '$attrs',
    '$ionicViewService',
    '$animate',
    '$compile',
    '$ionicNavBarDelegate',
    function($scope, $element, $attrs, $ionicViewService, $animate, $compile, $ionicNavBarDelegate) {
        //Let the parent know about our controller too so that children of
        //sibling content elements can know about us
        $element.parent().data('$ionNavBarController', this);

        var deregisterInstance = $ionicNavBarDelegate._registerInstance(this, $attrs.delegateHandle);

        $scope.$on('$destroy', deregisterInstance);

        $scope.$on('$viewHistory.historyChange', function(e, data) {
            backIsShown = !!data.showBack;
        });

        var self = this;

        this.leftButtonsElement = angular.element( // jqLite(
            $element[0].querySelector('.buttons.left-buttons')
        );
        this.rightButtonsElement = angular.element( // jqLite(
            $element[0].querySelector('.buttons.right-buttons')
        );

        this.back = function() {
            var backView = $ionicViewService.getBackView();
            backView && backView.go();
            return false;
        };

        this.align = function(direction) {
            this._headerBarView.align(direction);
        };

        this.showBackButton = function(show) {
            if (arguments.length) {
                $scope.backButtonShown = !!show;
            }
            return !!($scope.hasBackButton && $scope.backButtonShown);
        };

        this.showBar = function(show) {
            if (arguments.length) {
                $scope.isInvisible = !show;
                $scope.$parent.$hasHeader = !!show;
            }
            return !$scope.isInvisible;
        };

        this.setTitle = function(title) {
            if ($scope.title === title) {
                return;
            }
            $scope.oldTitle = $scope.title;
            $scope.title = title || '';
        };

        this.changeTitle = function(title, direction) {
            if ($scope.title === title) {
                // if we're not animating the title, but the back button becomes invisible
                if(typeof backIsShown != 'undefined' && !backIsShown && $scope.backButtonShown){
                    angular.element($element[0].querySelector('.back-button')).addClass('ng-hide');
                }
                return false;
            }
            this.setTitle(title);
            $scope.isReverse = direction == 'back';
            $scope.shouldAnimate = !!direction;

            if (!$scope.shouldAnimate) {
                //We're done!
                this._headerBarView.align();
            } else {
                this._animateTitles();
            }
            return true;
        };

        this.getTitle = function() {
            return $scope.title || '';
        };

        this.getPreviousTitle = function() {
            return $scope.oldTitle || '';
        };

        /**
        * Exposed for testing
        */
        this._animateTitles = function() {
            var oldTitleEl, newTitleEl, currentTitles;

            //If we have any title right now
            //(or more than one, they could be transitioning on switch),
            //replace the first one with an oldTitle element
            currentTitles = $element[0].querySelectorAll('.title');
            if (currentTitles.length) {
                oldTitleEl = $compile('<h1 class="title" ng-bind-html="oldTitle"></h1>')($scope);
                angular.element(currentTitles[currentTitles.length-1]).replaceWith(oldTitleEl);
            }
            //Compile new title
            newTitleEl = $compile('<h1 class="title invisible" ng-bind-html="title"></h1>')($scope);

            //Animate in on next frame
            ionic.requestAnimationFrame(function() {

                oldTitleEl && $animate.leave(angular.element(oldTitleEl));

                var insert = oldTitleEl && angular.element(oldTitleEl) || null;
                $animate.enter(newTitleEl, $element, insert, function() {
                    self._headerBarView.align();
                });

                //Cleanup any old titles leftover (besides the one we already did replaceWith on)
                forEach(currentTitles, function(el) {
                    if (el && el.parentNode) {
                        //Use .remove() to cleanup things like .data()
                        angular.element(el).remove();
                    }
                });

                //$apply so bindings fire
                $scope.$digest();

                //Stop flicker of new title on ios7
                ionic.requestAnimationFrame(function() {
                    newTitleEl[0].classList.remove('invisible');
                });
            });
        };
    }
]);


app.directive('fpNavBar', [
    '$ionicViewService',
    '$rootScope',
    '$animate',
    '$compile',
    '$ionicNavBarConfig',
    function($ionicViewService, $rootScope, $animate, $compile, $ionicNavBarConfig) {

        return {
            restrict: 'E',
            controller: '$fpNavBar',
            scope: true,
            compile: function(tElement, tAttrs) {
                //We cannot transclude here because it breaks element.data() inheritance on compile
                tElement
                .addClass('bar bar-header nav-bar')
                .append(
                    '<div class="buttons left-buttons"> ' +
                    '</div>' +
                    '<h1 ng-bind-html="title" class="title"></h1>' +
                    '<div class="buttons right-buttons"> ' +
                    '</div>'
                );

                if (angular.isDefined(tAttrs.animation)) {
                    tElement.addClass(tAttrs.animation);
                } else {
                    tElement.addClass($ionicNavBarConfig.transition);
                }

                return { pre: prelink };
                function prelink($scope, $element, $attr, navBarCtrl) {
                    navBarCtrl._headerBarView = new HeaderBar({
                        el: $element[0],
                        alignTitle: $attr.alignTitle || $ionicNavBarConfig.alignTitle || 'center'
                    });

                    //defaults
                    $scope.backButtonShown = false;
                    $scope.shouldAnimate = true;
                    $scope.isReverse = false;
                    $scope.isInvisible = true;

                    $scope.$on('$destroy', function() {
                        $scope.$parent.$hasHeader = false;
                    });

                    $scope.$watch(function() {
                        return ($scope.isReverse ? ' reverse' : '') +
                        ($scope.isInvisible ? ' invisible' : '') +
                        (!$scope.shouldAnimate ? ' no-animation' : '');
                    }, function(className, oldClassName) {
                        $element.removeClass(oldClassName);
                        $element.addClass(className);
                    });

                }
            }
        };
    }
]);

var HeaderBar = ionic.views.View.inherit({
    initialize: function(opts) {
        this.el = opts.el;

        ionic.extend(this, {
            alignTitle: 'center'
        }, opts);

        this.align();
    },

    align: function(align) {

        align || (align = this.alignTitle);

        // Find the titleEl element
        var titleEl = this.el.querySelector('.title');
        if(!titleEl) {
            return;
        }

        var self = this;
        //We have to rAF here so all of the elements have time to initialize
        ionic.requestAnimationFrame(function() {
            var i, c, childSize;
            var childNodes = self.el.childNodes;
            var leftWidth = 0;
            var rightWidth = 0;
            var isCountingRightWidth = false;

            // Compute how wide the left children are
            // Skip all titles (there may still be two titles, one leaving the dom)
            // Once we encounter a titleEl, realize we are now counting the right-buttons, not left
            for(i = 0; i < childNodes.length; i++) {
                c = childNodes[i];
                if (c.tagName && c.tagName.toLowerCase() == 'h1') {
                    isCountingRightWidth = true;
                    continue;
                }
                else if ((' '+c.className+' ').indexOf(' search ') >= 0)  {
                    console.log(c);
                    continue;
                }

                childSize = null;
                if(c.nodeType == 3) {
                    var bounds = ionic.DomUtil.getTextBounds(c);
                    if(bounds) {
                        childSize = bounds.width;
                    }
                } else if(c.nodeType == 1) {
                    childSize = c.offsetWidth;
                }
                if(childSize) {
                    if (isCountingRightWidth) {
                        rightWidth += childSize;
                    } else {
                        leftWidth += childSize;
                    }
                }
            }

            var margin = Math.max(leftWidth, rightWidth) + 10;

            //Reset left and right before setting again
            titleEl.style.left = titleEl.style.right = '';

            // Size and align the header titleEl based on the sizes of the left and
            // right children, and the desired alignment mode
            if(align == 'center') {
                if(margin > 10) {
                    titleEl.style.left = margin + 'px';
                    titleEl.style.right = margin + 'px';
                }
                if(titleEl.offsetWidth < titleEl.scrollWidth) {
                    if(rightWidth > 0) {
                        titleEl.style.right = (rightWidth + 5) + 'px';
                    }
                }
            } else if(align == 'left') {
                titleEl.classList.add('title-left');
                if(leftWidth > 0) {
                    titleEl.style.left = (leftWidth + 15) + 'px';
                }
            } else if(align == 'right') {
                titleEl.classList.add('title-right');
                if(rightWidth > 0) {
                    titleEl.style.right = (rightWidth + 15) + 'px';
                }
            }
        });
    }
});
