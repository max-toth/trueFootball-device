angular.module('starter.controllers', ['yaMap'])

    .controller('AppCtrl', function ($scope) {
    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 },
            { title: 'Funk', id: 7 }
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

    .controller('MapController', function ($http, $scope) {

        $scope.geoObjects = [
            {
                geometry: {
                    type: "Point",
                    coordinates: [30.270, 59.956]
                },
                // Свойства.
                properties: {
                    // Контент метки.
                    iconContent: 'Я тащусь',
                    hintContent: 'Ну давай уже тащи'
                }
            },
            {
                geometry: {
                    type: 'Point',
                    coordinates: [30.275, 59.950]
                },
                properties: {
                    balloonContent: "Радиус круга - 10 км",
                    hintContent: "Подвинь меня"
                }
            }
        ];

        var map;

        $scope.afterMapInit = function (_map) {
            map = _map;
            jQuery.getJSON('/events').success(function (data) {
                jQuery.each(data.events, function (index, event) {
//                $scope.geoObjects.push(new ymaps.Placemark([event.y, event.x], {
//                    balloonContentHeader: sports[event.sport - 1].title,
//                    balloonContentBody: event.description
//                }));
                    console.log(event);

                    $scope.geoObjects.push({
                        geometry: {
                            type: "Point",
                            coordinates: [30.260, 59.940]
                        },
                        properties: {
                            iconContent: 'Я тащусь',
                            hintContent: 'Ну давай уже тащи'
                        }
                    });
                });
            });
        }
    })

    .controller('EventsController', function ($http, $scope) {
        $scope.sports = [
            {title: 'Soccer', value: 1},
            {title: 'Hockey', value: 2},
            {title: 'Basketball', value: 3},
            {title: 'Bikes', value: 4},
            {title: 'Break dance', value: 5},
            {title: 'Boarding', value: 6},
            {title: 'Volleyball', value: 7}
        ];

        $scope.event = {};

        $scope.addEvent = function (event) {
            event.position = {x: 0, y: 0};

            $http.get('http://geocode-maps.yandex.ru/1.x/?format=json&results=1&geocode=Россия,Санкт-Петербург,' + event.address).success(function (geoAddress) {
                var point = geoAddress.response.GeoObjectCollection.featureMember[0].GeoObject.Point;
                var pos = point.pos.split(' ');
                event.position = {x: Number(pos[0]), y: Number(pos[1])};
                map.geoObjects.add(new ymaps.Placemark([event.position.y, event.position.x], {
                    balloonContentHeader: event.sport.title,
                    balloonContentBody: event.description
                }));

                var data = {event: event};
                $http.post('/events', data);
            });
        }
    })