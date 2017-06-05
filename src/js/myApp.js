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