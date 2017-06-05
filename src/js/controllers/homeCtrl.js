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