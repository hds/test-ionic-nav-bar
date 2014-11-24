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
            controller: 'PlaylistListCtrl as ctrl',
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
        { title: 'Cowbell', id: 6 },
        { title: 'Rock', id: 7 },
        { title: 'Pop', id: 8 },
        { title: 'Heavy Metal', id: 9 },
        { title: 'Electro', id: 10 }
    ];

});

app.controller('PlaylistListCtrl', function()  {
    var self = this;

    self.search = false;
    self.toggle_search = function()  {
        console.log('search: ' + self.search + ' --> ' + !self.search);
        self.search = ! self.search;
    };

    self.menu = false;
    self.toggle_menu = function()  {
        console.log('menu: ' + self.menu + ' --> ' + !self.menu);
        self.menu = ! self.menu;
    };
});

app.controller('PlaylistDetailCtrl', function($stateParams) {
    var self = this;

    self.playlist_id = $stateParams.playlist_id;
});
