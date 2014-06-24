var map;

angular.module('starter.controllers', ['yaMap'])

    .controller('AppCtrl', function ($scope) {
        $scope.afterMapInit = function (_map) {
            map = _map;
        };
    })
    .controller('MapController', function ($http, $scope, Config, geoObjects, Sports, DataService, templateLayoutFactory) {
        var uid;

        DataService.get('uid').then(function(data){
            console.log('recieved uid ' + data);
            uid = data;
        });
        $scope.geoObjects = geoObjects;

        $http.get(Config.apiUrl + '/events').success(function (data) {
            angular.forEach(data.events, function (event, index) {
                console.log(event);
                geoObjects.push({
                    geometry: {
                        type: "Point",
                        coordinates: [Number(event.x), Number(event.y)]
                    },
                    properties: {
                        iconContent: Sports[event.sport - 1].title,
                        hintContent: ''
                    }
                });
            });
            console.log(geoObjects);
        });

        var counter = 0;

        $scope.overrides = {
            build: function () {
                // Сначала вызываем метод build родительского класса.
                console.log('build');
                console.log(templateLayoutFactory);
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
                console.log();
                var request = {
                    uid: uid,
                    eventId: document.getElementById('joinButton').getAttribute('data-event-id')
                };
                console.log(request);

                /**
                 * POST http://backend.api/join
                 */
                $http.post(Config.apiUrl + '/join', request);
            },
            onCounterClick: function () {
                console.log(++counter);
            }
        };
    })

    .controller('EventsController', function ($http, $scope, geoObjects, Sports, Config) {
        $scope.sports = [
            {title: 'Футбол', value: 1},
            {title: 'Хоккей', value: 2},
            {title: 'Баскетбол', value: 3},
            {title: 'Bikes', value: 4},
            {title: 'Брейк-данс', value: 5},
            {title: 'Boarding', value: 6},
            {title: 'Волейбол', value: 7}
        ];

        $scope.event = {};

        $scope.addEvent = function (event) {
//            console.log(event);
            event.position = {x: 0, y: 0};

            $http.get('http://geocode-maps.yandex.ru/1.x/?format=json&results=1&geocode=Россия,Санкт-Петербург,' + event.address).success(function (geoAddress) {
                var point = geoAddress.response.GeoObjectCollection.featureMember[0].GeoObject.Point;
                var pos = point.pos.split(' ');
                event.position = {x: Number(pos[0]), y: Number(pos[1])};
//                geoObjects.add(new ymaps.Placemark([event.position.y, event.position.x], {
//                    balloonContentHeader: event.sport.title,
//                    balloonContentBody: event.description
//                }));

//                console.log(geoObjects);
                geoObjects.push({
                    geometry: {
                        type: "Point",
                        coordinates: [event.y, event.x]
                    },
                    properties: {
                        iconContent: event.sport.title,
                        hintContent: event.description
                    }
                });

                var data = {event: event};
                $http.post(Config.apiUrl + '/events', data);
            });
        }
    })