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
                            deferred.reject(message);
                        });
                    }
                } else {
                    deferred.resolve(localStorage.getItem(key));
                }
                return deferred.promise;
            },
            set: function (key, value) {
                localStorage.setItem(key, value);
            }
        }
    })

    .constant('Config', {
        //apiUrl: 'http://sport-seeker.herokuapp.com'
        apiUrl: 'http://localhost:3000'
    })

    .constant('Sports', [
        {title: 'Футбол', value: 1, icon: 'ion-ios7-football'},
        {title: 'Хоккей', value: 2, icon: 'ion-steam'},
        {title: 'Баскетбол', value: 3, icon: 'ion-ios7-basketball'},
        {title: 'Bikes', value: 4, icon: 'ion-model-s'},
        {title: 'Брейк-данс', value: 5, icon: 'ion-woman'},
        {title: 'Boarding', value: 6, icon: 'ion-ios7-pulse'},
        {title: 'Волейбол', value: 7, icon: 'ion-social-dribbble-outline'}
    ]);
