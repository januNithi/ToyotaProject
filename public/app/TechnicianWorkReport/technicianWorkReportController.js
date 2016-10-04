/**
 * Created by CSS on 20-09-2016.
 */
(function () {

    angular
        .module('toyotaApp')
        .controller('technicianWorkReportController', technicianWorkReportController);

    technicianWorkReportController.$inject = [
        '$scope',
        'technicianWorkReportService',
        'defaultInvalidPicture',
        'downloadReportPath',
        '$window'
    ];

    function technicianWorkReportController($scope, technicianWorkReportService, defaultInvalidPicture,downloadReportPath,$window) {

        $scope.file = defaultInvalidPicture;

        $scope.registrations = [];

        $scope.reportData = [];

        $scope.choosenId = '';

        $scope.loadReport = false;

        $scope.model = '';
        $scope.service = '';

        $scope.registrationIdSelected = function (choosenId) {

            angular.forEach($scope.registrations,function (value,index) {

                if(value.Sid == choosenId){
                    $scope.model = value.Mid;
                    $scope.service = value.MType;
                }

            });

            technicianWorkReportService.getWorkCompleted(choosenId).then(function (result) {
                $scope.reportData = result.data;
                $scope.loadReport = true;
            },function (error) {
                console.log(error);
            });

        };

        $scope.downloadReport = function () {

            technicianWorkReportService.downloadReport($scope.reportData).then(function (result) {

                $window.open(result);
                // $window.open(downloadReportPath+'data.xlsx');
                technicianWorkReportService.deleteFile();


            });

        };

        $scope.getRegistrations = function () {

            technicianWorkReportService.getRegistrations().then(function (result) {
               $scope.registrations = result.data;
            },function (error) {
                console.log(error);
            });

        };

        $scope.goToDashboard = function () {
            technicianWorkReportService.goToDashboard();
        };
        
        $scope.showImage = function (image) {
            if(image != null && image != 0 && image != '0,0'){
                return "data:image/jpeg;base64,"+image;
            }
            return $scope.file;

        }

        $scope.getRegistrations();

    }

})();