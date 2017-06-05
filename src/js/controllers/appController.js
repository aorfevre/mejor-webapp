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