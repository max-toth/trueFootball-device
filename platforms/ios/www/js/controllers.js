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

    .controller('MapController', function ($http, $scope, Config, geoObjects, Sports) {
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
        $scope.geoObjects = geoObjects;
    })

    .controller('EventsController', function ($http, $scope, geoObjects, Sports, Config) {
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