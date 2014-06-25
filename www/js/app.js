// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers'])

    .run(function ($ionicPlatform) {

        

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
                // window.StatusBar.overlaysWebView(false);
                // window.StatusBar.backgroundColorByHexString('#FAE6C9');
            }           
        });
    })

    .service('DataService', function (Config, $q, $http) {
        return {
            get: function (key) {
                var deferred = $q.defer();
                if (key === 'uid') {
                    var uid = localStorage.getItem(key);
                    if (uid) {
                        deferred.resolve(uid);
                    } else {
                        $http.get(Config.apiUrl + '/uid').success(function (data) {
                            deferred.resolve(data.uid);
                            localStorage.setItem('uid', data.uid);
                        }).error(function (message) {
                            console.log(message);
                            deferred.reject(message);
                        });
                    }
                } else {
                    deferred.resolve(localStorage.getItem(key));
                }
                return deferred.promise;
            }
        }
    })

    .value('Config', {
        apiUrl: 'http://localhost:3000'
    })

    .value('geoObjects', [
        /*{
            geometry: {
                type: "Point",
                coordinates: [30.270, 59.956]
            },
            properties: {
//                balloonContentHeader: '<span>Футбол</span>',
                id: 1234,
                persons: 12,
                address: 'Здоровцева 31',
                post: 'Играем во дворе, берите бутсы и кеды'
            }
        }*/
    ])

    .value('Sports', [
        {title: 'Soccer', value: 1},
        {title: 'Hockey', value: 2},
        {title: 'Basketball', value: 3},
        {title: 'Bikes', value: 4},
        {title: 'Break dance', value: 5},
        {title: 'Boarding', value: 6},
        {title: 'Volleyball', value: 7}
    ])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                }
            })
            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            })
            .state('app.map', {
                url: "/map",
                views: {
                    'menuContent': {
                        templateUrl: "templates/map.html",
                        controller: 'MapController'
                    }
                }
            })

            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            })

            .state("app.event", {
                url: "/events",
                views: {
                    'menuContent': {
                        templateUrl: "templates/event-form.html",
                        controller: 'EventsController'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/map');
    });

