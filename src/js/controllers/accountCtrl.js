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