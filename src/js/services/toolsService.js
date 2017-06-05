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