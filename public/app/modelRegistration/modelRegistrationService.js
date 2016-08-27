/**
 * Created by CSS on 29-07-2016.
 */

(function () {
    angular
        .module("toyotaApp")
        .factory('modelRegistrationService', modelRegistrationService);

    modelRegistrationService.$inject = [
        '$http',
        '$window'
    ];
    function modelRegistrationService ($http,$window) {
        return {

            getModels : function () {

                return $http.get(
                    '/model/getModel'
                );

            },

            goToDashboard : function () {

                $window.location.href = '/';

            },

            updateModel : function (model) {

                return $http.post('/model/postModel',model);

            },

            deleteAModel : function (model) {

                return $http.post('/model/removeModel',model);

            }

        };
    }
})();

