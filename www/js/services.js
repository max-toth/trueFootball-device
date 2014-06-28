angular.module('starter.services', [])
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

    .constant('Config', {
        //apiUrl: 'http://sport-seeker.herokuapp.com'
        apiUrl: 'http://localhost:3000'
    })

    .constant('Sports', [
        {title: 'Футбол', value: 1},
        {title: 'Хоккей', value: 2},
        {title: 'Баскетбол', value: 3},
        {title: 'Bikes', value: 4},
        {title: 'Брейк-данс', value: 5},
        {title: 'Boarding', value: 6},
        {title: 'Волейбол', value: 7}
    ])
