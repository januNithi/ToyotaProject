/**
 * Created by CSS on 22-09-2016.
 */
(function(){

    angular.module('toyotaApp').service('measureService',measureService);
    measureService.$inject=['$http','$window'];

    function measureService($http,$window)
    {
        return{

            getMeasures:function()

            {

                return $http({

                    method:'GET',
                    url:'/connect/getMeasures?modelType = "ALL"'

                });

            },
            saveMeasure:function(data){

                return $http({

                    method:'POST',
                    url:'/connect/updateMeasure',
                    data:data


                });



            },
            deleteMeasure:function(data){

                return $http({

                    method:'post',
                    url:'/connect/deleteMeasure',
                    data:data


                });



            },
            goToDashboard : function () {

                $window.location.href = '/';

            }


        }

    }
})();