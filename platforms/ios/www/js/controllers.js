angular.module('starter.controllers', ['yaMap'])
    .controller('AppCtrl', function ($scope, sharedData, Sports) {
        $scope.search = sharedData.search;
        $scope.sports = Sports;

        $scope.isOff = function (item) {
            return !~sharedData.search.sports.indexOf(item);
        };

        $scope.toggleFilter = function (sport) {
            var index = sharedData.search.sports.indexOf(sport);

            if (index == -1) {
                sharedData.search.sports.push(sport);
            } else {
                sharedData.search.sports.splice(index, 1);
            }
        };
    })
    .value('sharedData', { eventToOpen: null, search: { sports: [] } })
    .controller('MapController', function (
            $scope, $http, $timeout,
            $ionicPopup,
            templateLayoutFactory,
            Config, Sports, DataService,
            sharedData
        ) {
        var _uid;
        DataService.get('uid').then(function (data) {
            _uid = data;
        });

        $scope.geoObjects = [];
        $scope.search = sharedData.search;

        $http.get(Config.apiUrl + '/events').success(function (data) {
            angular.forEach(data, function (event) {
                $scope.geoObjects.push({
                    geometry: {
                        type: "Point",
                        coordinates: [Number(event.x), Number(event.y)]
                    },
                    properties: {
                        iconContent: Sports[event.sport - 1].title,
                        hintContent: '',
                        event: event
                    }
                });
            });
        });

        $scope.maybeOpen = function(geoObject) {
            if (!sharedData.eventToOpen) return;

            if (geoObject.properties.get('event').id == sharedData.eventToOpen) {
                sharedData.eventToOpen = null;
                $timeout(function () {
                    geoObject.balloon.open();
                });
            }
        };

        $scope.overrides = {
            build: function () {
                // Сначала вызываем метод build родительского класса.
                var BalloonContentLayout = templateLayoutFactory.get('templateOne');
                BalloonContentLayout.superclass.build.call(this);
//                А затем выполняем дополнительные действия.

                angular.element(document.getElementById('joinButton')).bind('click', this.joinEventClick);
            },

            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                angular.element(document.getElementById('counter-button')).unbind('click', this.onCounterClick);
                var BalloonContentLayout = templateLayoutFactory.get('templateOne');
                BalloonContentLayout.superclass.clear.call(this);
            },

            joinEventClick: function () {
                var request = {
                    uid: _uid,
                    eventId: document.getElementById('joinButton').getAttribute('data-event-id')
                };

                /**
                 * POST http://backend.api/join
                 */
                $http.post(Config.apiUrl + '/events/join', request)
                    .success(function (data) {
                        if (data.uid != _uid) {
                            DataService.set('uid', data.uid);
                            _uid = data.uid;
                        }

                        var event = data.event;

                        if (document.getElementById('joinButton').getAttribute('data-event-id') == event.id)
                            document.getElementById('eventCapacity').innerHTML = event.count + '/' + event.capacity;
                        for (var i = 0; i < $scope.geoObjects.length; i++) {
                            if ($scope.geoObjects[i].properties.event.id == event.id) {
                                $scope.geoObjects[i].properties.event = event;
                            }
                        }
                    })
                    .error(function (message) {
                        $ionicPopup.alert({
                            title: 'Не удалось присоединиться к событию',
                            template: message
                        });
                    });
            }
        };
    })

    .controller('EventsController', function (
            $scope, $location, $http,
            $ionicPopup, $ionicLoading,
            Sports, Config, DataService,
            sharedData
        ) {
        $scope.sports = Sports;

        $scope.event = {};

        var _uid;
        DataService.get('uid').then(function (data) {
            _uid = data;
        });

        $scope.addEvent = function (event) {
            event.position = { x: 0, y: 0 };
            event.start = event.date + ' ' + event.time;

            $http.get('http://geocode-maps.yandex.ru/1.x/?format=json&results=1&geocode=Россия,Санкт-Петербург,' + event.address)
                .success(function (geoAddress) {
                    var point = geoAddress.response.GeoObjectCollection.featureMember[0].GeoObject.Point;
                    var pos = point.pos.split(' ');
                    event.position = { x: Number(pos[0]), y: Number(pos[1]) };

                    var data = { event: event, uid: _uid };

                    $ionicLoading.show({
                        template: 'Пожалуйста, подождите...'
                    });

                    $http.post(Config.apiUrl + '/events', data)
                        .success(function (response) {
                            if (response.uid != _uid) {
                                DataService.set('uid', response.uid);
                                _uid = response.uid;
                            }
                            sharedData.eventToOpen = response.event.id;
                            $location.path('/app/map');
                        })
                        .error(function (message) {
                            $ionicPopup.alert({
                                title: 'Не удалось добавить событие',
                                template: message
                            });
                        })
                        .finally($ionicLoading.hide);
                })
                .error(function(message) {
                    $ionicPopup.alert({
                        title: 'Ошибка при поиске адреса',
                        template: message
                    });
                });
        }
    });