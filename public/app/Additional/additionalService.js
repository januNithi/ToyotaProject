/**
 * Created by CSS on 22-09-2016.
 */
(function(){

    angular.module('toyotaApp').service('additionalService',additionalService);
    additionalService.$inject=['$http','$window'];

    function additionalService($http,$window)
    {
        return{

            getAdditionals:function()

            {

                return $http({

                    method:'GET',
                    url:'/connect/getAdditional'

                });

            },
            saveAdditional:function(data){

                return $http({

                    method:'POST',
                    url:'/connect/updateAdditional',
                    data:data


                });



            },
            deleteAdditional:function(data){

                return $http({

                    method:'post',
                    url:'/connect/deleteAdditional',
                    data:data


                });



            },
            goToDashboard : function () {

                $window.location.href = '/';

            }


        }

    }
})();