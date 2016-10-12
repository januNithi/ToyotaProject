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
        $scope.date = '';

        $scope.registrationIdSelected = function (choosenId) {

            angular.forEach($scope.registrations,function (value,index) {

                if(value.Sid == choosenId){
                    $scope.model = value.Mid;
                    $scope.service = value.MType;
                    $scope.date = value.date;

                    $scope.time = value.time;
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

        };

        $scope.printDiv = function (divName) {


            var document = $window.print();
            console.log(document);

            // var printContents = document.getElementById(divName).outerHTML;
            // var originalContents = document.body;
            //
            // if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            //     var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            //     popupWin.window.focus();
            //     popupWin.document.write('<!DOCTYPE html><html><head>' +
            //             '<link rel="stylesheet" type="text/css" href="../../bower_components/font-awesome/css/font-awesome.min.css"/>' +
            //         '<link rel="stylesheet" type="text/css" href="../../css/bootstrap.min.css"/>'+
            //         '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div>'+
            //          ' <script src="app/TechnicianWorkReport/technicianWorkReportService.js"></script>'+
            //         '<script src="app/TechnicianWorkReport/technicianWorkReportController.js"></script>'+
            //         '</body></html>');
            //     popupWin.onbeforeunload = function (event) {
            //         popupWin.close();
            //
            //         return '.\n';
            //     };
            //     popupWin.onabort = function (event) {
            //
            //         popupWin.document.close();
            //         popupWin.close();
            //     }
            // } else {
            //     var popupWin = window.open('', '_blank', 'width=800,height=600');
            //     popupWin.document.open();
            //     popupWin.document.write('<html><head>' +
            //         '<link rel="stylesheet" type="text/css" href="style.css" />' +
            //         '<link rel="stylesheet" type="text/css" href="../../bower_components/font-awesome/css/font-awesome.min.css"/>' +
            //         '<link rel="stylesheet" type="text/css" href="../../css/bootstrap.min.css"/></head>' +
            //         '<body onload="window.print()">' + printContents + '' +
            //         '<script src="app/TechnicianWorkReport/technicianWorkReportService.js"></script>'+
            //         '<script src="app/TechnicianWorkReport/technicianWorkReportController.js"></script></html>');
            //
            //     popupWin.document.close();
            // }
            // popupWin.document.close();

            return true;
        }

        $scope.getRegistrations();

    }

})();