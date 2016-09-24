(function(){

    angular.module('toyotaApp').service('jobRegistrationService',jobRegistrationService);
    jobRegistrationService.$inject=['$http'];
    
    function jobRegistrationService($http)
    {
        return{



            serviceRegDetails:function()
        
        {
            
            return $http({
                
                method:'GET',
                url:'/getJobRegistration'
                
            });
            
        },

            postUpdateJobReg:function(data){


                return $http({

                    method:'POST',
                    url:'/postServiceRegistration',
                    data:data


                });
            },

            saveNewJobService:function(data){

                return $http({

                    method:'POST',
                    url:'/saveNewJobService',
                    data:data


                });



            },
            deleteJobReg:function(data){

                return $http({

                    method:'POST',
                    url:'/deleteJobService',
                    data:data


                });



            },

            getModels : function () {

                return $http.get(
                    '/model/getModel'
                );

            }


            
        }
        
    }
})();