(function(global) {

    'use strict';

    global.app = angular.module('myApp', ['ui.router', 'toaster']);

    app.config(


            //{{
            function($stateProvider, $urlRouterProvider) {

                $urlRouterProvider.otherwise("home");

                $stateProvider
                // global state of the app. this is the menu and elements that are always visible
                    .state('app', { 
                        url: "/",
                        templateUrl: "templates/base.html",
                        controller: "AppCtrl"
                    })
                // home page; with creation of new account
                    .state('app.home', {
                        url: "home",
                        templateUrl: "templates/home.html",
                        controller: "HomeCtrl"


                    })
                // specific account page
                    .state('app.account', {
                        url: "account/:email",
                        params: {myAccount: null},
                        templateUrl: "templates/account.html",
                        controller: "AccountCtrl"

                    })


            }
        )
        .config(['$locationProvider', function($locationProvider) {
            $locationProvider.hashPrefix(''); // by default '!'
            // $locationProvider.html5Mode({
            //     enabled: true,
            //     requireBase: false
            // });
        }]);

})(this);
(function(app) {
    'use strict';

    app.controller('AccountCtrl',

        function($scope, $gpsService, $tools, toaster, $state, $apiService, $timeout) {


            $scope.myModel = {
                currency: 'USD'
            }

            var _init = function() {
                console.warn("PARAMS", $state.params.myAccount)
                    //if we access to the account page through the modal
                if ($state.params.myAccount !== null) {
                    $timeout(function() { //this is to call automaticly the digest after affecting datas.
                        $scope.myModel = $state.params.myAccount
                    }, 1)


                } else if ($state.params.email !== null && $state.params.email !== '') {

                    //if we access directly to the page by typing email
                    $apiService.getUser($state.params.email).then(function(res) {
                            if (res.status === 204) {

                                toaster.pop({
                                    type: 'warning',
                                    title: 'No account founded',
                                    body: 'There is no account for this email; select another email',
                                    timeout: 3000
                                });
                            } else if (res.status === 200 || res.status === 304) {

                                $scope.myModel = res.data;
                                $scope.myModel.birthdate = new Date(res.data.birthdate); // convert iso date to date

                                console.log("result", $scope.myModel)
                            }
                        },
                        function(err) {
                            $state.transitionTo('app.home');
                        })
                }
            }

            angular.element(document).ready(function() {
                _init()
            });



        }
    );


})(app);
(function(app) {
    'use strict';

    app.controller('AppCtrl',

        function($scope, $rootScope, $apiService, toaster, $state) {


            // this function is located in this controller as it is a function linked to the menu
            // it s a project wide function; accessible anytime
            $scope.getPlanByEmail = function(email) {

                $apiService.getUser(email).then(function(res) {


                    if (res.status === 204) {

                        toaster.pop({
                            type: 'warning',
                            title: 'No account founded',
                            body: 'There is no account for this email; select another email',
                            timeout: 3000
                        });
                    } else if (res.status === 200 || res.status === 304) {
                        $('#myModal').modal('hide');
                        $state.transitionTo('app.account', {
                            email: email,
                            myAccount: res.data
                        })
                    }
                }, function(err) {
                    $('#myModal').modal('hide');
                    toaster.pop({
                        type: 'error',
                        title: 'Error occured',
                        body: 'An error has occured; please try again later',
                        timeout: 3000
                    });
                })
            }



        }
    );


})(app);
(function(app) {
    'use strict';

    app.controller('HomeCtrl',

        function($scope, $gpsService, $apiService, $tools, toaster) {

            $scope.myModel = {
                plan: 'premium', // default value
                currency: 'USD'
            };

            $scope.countries = $gpsService.getCountries();


            $scope.postUser = function() {

                //create user bean
                var _newUser = {
                    email: $scope.myModel.email,
                    user: $scope.myModel.user,
                    password: $scope.myModel.password,
                    birthdate: new Date($scope.myModel.birthdate).toISOString(),
                    country_code: $scope.myModel.country.code,
                    country_name: $scope.myModel.country.name,
                    plan: $scope.myModel.plan,
                    plan_value: $tools.getPlanValueFromCode($scope.countries, $scope.myModel.country.code, $scope.myModel.plan),
                    plan_currency: $scope.myModel.currency
                }

                if ($scope.myModel.country.code === 'OTHER')
                    _newUser.country_name = $scope.myModel.other;


                $apiService.postUser(_newUser).then(function(res) {
                    //TODO 

                    if (res.status === 201) {
                        //user is created
                        toaster.pop({
                            type: 'success',
                            title: 'Adding user success',
                            body: 'Your account has been successfully created ! Enjoy our service !',
                            timeout: 3000
                        });
                    } else if (res.status === 409) {
                        // email already exists; notify user

                        toaster.pop({
                            type: 'error',
                            title: 'Error while adding account',
                            body: 'Email already exists; please set up a different mail',
                            timeout: 3000
                        });
                    } else if (res.status > 201) {
                        //error status

                        toaster.pop({
                            type: 'error',
                            title: 'Error while adding account',
                            body: 'Error has occured; please try again later',
                            timeout: 3000
                        });
                    }
                }, function(err) {
                    //TODO 
                    toaster.pop({
                        type: 'error',
                        title: 'Error while adding account',
                        body: 'Error has occured; please try again later',
                        timeout: 3000
                    });
                })


            }

            // private init function
            // get user country by ip calling external webservice
            var _init = function() {
                $tools.setConsoleBannerLog()

                $gpsService.getCountryFromIp().then(function(result) {

                    $scope.myModel.country = $tools.findCountryByCode($scope.countries, result.code)

                    if ($scope.myModel.country.code === 'OTHER') {
                        $scope.myModel.other = result.country;
                    }


                }, function(errStatus) {
                    // if it is not possible to retreive a country; set by default OTHER (errStatus return)
                    // empty input
                    $scope.myModel.country = $tools.findCountryByCode($scope.countries, errStatus)
                    $scope.myModel.other = ""
                })
            }



            angular.element(document).ready(function() {
                _init()
            });



        }
    );


})(app);
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
(function(app) {
    'use strict';

    app
        .factory('$tools',

            //{{
            function() {



                var factory = {};


                // parse a country array and a code to find a match
                // if no match; return OTHER
                factory.findCountryByCode = function(countries, code) {
                    var _otherCode = 0

                    for (var i = 0; i < countries.length; i++) {
                        if (code === countries[i].code)
                            return countries[i];

                        // remember position of OTHER in case of no result found
                        if (countries[i].code === 'OTHER')
                            _otherCode = i

                    }

                    // if no code is found; we set the OTHER code

                    return countries[_otherCode];

                }

                // Get my plan value from a country code and a plan number
                factory.getPlanValueFromCode = function(countries, code, plan) {
                    for (var i = 0; i < countries.length; i++) {
                        if (code === countries[i].code)
                            return countries[i][plan]
                    }
                }


                // Javascript console Banner - Geek purposes
                factory.setConsoleBannerLog = function() {
                    console.log("  _   _   _   _   _     _   _  ")
                    console.log(" / \\ / \\ / \\ / \\ / \\   / \\ / \\ ")
                    console.log("( P | o | w | e | r ) ( b | y )")
                    console.log(" \\_/ \\_/ \\_/ \\_/ \\_/   \\_/ \\_/ ")
                    console.log("  _   _   _   _   _   _   _   _  ")
                    console.log(" / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ ")
                    console.log("( A | O | R | F | E | V | R | E )")
                    console.log(" \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ ")
                    console.log("  _   _   _   _   _   _   _   _   _   _   _   _   _   _   _   _   _   _   _  ");
                    console.log(" / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ / \\ ");
                    console.log("( a | l | e | x | a | n | d | r | e | @ | r | i | z | z | e | . | c | o | m )");
                    console.log(" \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/ \\_/");
                }



                return factory;
            }
            //}}

        );


})(app);