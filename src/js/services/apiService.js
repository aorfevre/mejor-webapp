(function(app) {
    'use strict';

    app
        .factory('$apiService',

            //{{
            function($q, $log, $http, $window) {



                var factory = {};


                factory.getUser = function(email) {

                    var d = $q.defer();

                    var configQuery = {
                        'url': "http://localhost:3000/user/" + email,
                        'method': "GET"
                    };
                    $http(configQuery).then(function(res) {


                        d.resolve(res);

                    }, function(err) {
                        d.reject(err);
                    })

                    return d.promise;


                }

                factory.postUser = function(user) {

                    var d = $q.defer();

                    var configQuery = {
                        'url': "http://localhost:3000/user/",
                        'method': "POST",
                        'data': user
                    };

                    console.log("POST user ", configQuery)
                    $http(configQuery).then(function(res) {

                        d.resolve(res);

                    }, function(err) {
                        d.reject(err);
                    })

                    return d.promise;


                }

                return factory;
            }
            //}}

        );


})(app);