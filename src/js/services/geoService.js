(function(app) {
    'use strict';

    app
        .factory('$gpsService',

            //{{





            function($q, $log, $http, $window) {



                var factory = {};


                // Static countries datas
                var countries = [{
                        name: 'Uruguay',
                        code: 'UY',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'El Salvador',
                        code: 'SV',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Chile',
                        code: 'CL',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'México',
                        code: 'MX',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Colombia',
                        code: 'CO',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Perú',
                        code: 'PE',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Argentina',
                        code: 'AR',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Costa Rica',
                        code: 'CR',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Ecuador',
                        code: 'EC',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Panamá',
                        code: 'PA',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Brasil',
                        code: 'BR',
                        basic: 5.90,
                        premium: 6.90
                    }, {
                        name: 'Other country',
                        code: 'OTHER',
                        basic: 9.90,
                        premium: 10.90
                    }


                ]

                // retrieve static country Array
                factory.getCountries = function() {
                    return countries;
                }

                // Get my country based on my public ip from an external website
                // this website returns a JSOn object with our country code.
                factory.getCountryFromIp = function() {

                    var d = $q.defer();

                    var configQuery = {
                        'url': "http://freegeoip.net/json/",
                        'method': "GET"
                    };
                    $http(configQuery).then(function(res) {

                        var _result = {
                            code: res.data.country_code,
                            country: res.data.country_name
                        }
                        d.resolve(_result);

                    })

                    return d.promise;


                }



                return factory;
            }
            //}}

        );


})(app);