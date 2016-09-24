(function(){

    angular.module('toyotaApp')
           .service('userRegistrationService',userRegistrationService);

    userRegistrationService.$inject=['$http'];

    function userRegistrationService($http)
    {

        return {

                    getEmployeeRegDetails: function ()
                    {

                       return $http({

                          method:'GET',
                           url:'/getEmployeeRegDetails'

                       });

                    },
                    postUpdateEmployeeDetails:function(data)
                    {   var fd = new FormData();
                        fd.append('DMI_NO',data.DMI_No);
                        fd.append('Name', data.Name);
                        fd.append('Designation', data.Designation);
                        fd.append('Username', data.Username);
                        fd.append('Password', data.Password);
                        fd.append('Bay_No', data.Bay_No);
                        fd.append('Flag', data.Flag);
                        fd.append('Date', data.Date);
                        fd.append('Photo',data.Photo);
                        fd.append('file',data.image[0]);
                        return $http({

                            method:'POST',
                            url:'/UpdateEmployeeRegDetails',
                            data:fd,
                            headers : {
                                'Content-Type' : undefined
                            },
                            transformRequest : angular.identity


                        });



                    },
                    saveEmployeeRegDetails:function(data){

                        var fd = new FormData();
                        fd.append('id',data.id);
                        fd.append('Name', data.Name);
                        fd.append('Designation', data.Designation);
                        fd.append('Username', data.Username);
                        fd.append('Password', data.Password);
                        fd.append('Bay_No', data.Bay_No);
                        fd.append('Flag', data.Flag);
                        fd.append('Photo',data.Photo);
                        fd.append('file', data.files[0]);
                        return $http({

                            method:'POST',
                            url:'/SaveEmployeeRegDetails',
                            data:fd,
                            headers : {
                                'Content-Type' : undefined
                            },
                            transformRequest : angular.identity


                        });

                    },
               deleteEmployeeDetails:function(Empdetails){
                   
  
                   return $http.post('/deleteEmployeeDetails',{data:Empdetails.DMI_No});



               }
 
                }


    }



})();