
app.controller('MainController', function($rootScope, $scope) {
    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;
    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });
});

app.controller('mainCtl', function($scope) {
});

app.controller('loginCtl', function($scope, $http, $location) {
    $scope.rememberMe = true;
    $scope.logininfo = {};
    if($scope.logininfo.strPassword == undefined){
        $scope.logininfo.strPassword = "";
    }
    $scope.login = function () {
        var jsonData = { strUserName:$scope.logininfo.strUserName,strPassword:hex_md5($scope.logininfo.strPassword)};
        $http({
            method: 'POST',
            url:    strWebServiceURL +"/login/user",
            data:   jsonData
        }).success(function (data) {
            if (data.status == "success") {
                $location.path('/main').replace();
            } else if (data.status == "failed") {
                $scope.message = "Wrong User Name Or Password.";
            }
        }).error(function (data) {
            $scope.message = "Connect to WebService failed.";
        });
    };
});

app.controller('pvCtl', function($scope, $http){
    $scope.gridOptions = {
        enableSorting: false,
        enableGrouping: false,
        enableColumnMenus: false,
        enablePaginationControls: false,
        paginationPageSize: 8,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 30,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        enableFiltering: false,
        data: {},
        columnDefs: [
            {field:'TrxNo', displayName:'TrxNo', visible: false },
            {field:'VoucherNo', displayName:'Voucher No', width: '28%', headerCellClass: 'text-center'},
            {field:'InvoiceAmt', displayName:'Amt', width: '14%', headerCellClass: 'text-center'},
            {field:'VendorName', displayName:'Vendor Name', width: '33%', headerCellClass: 'text-center'},
            {field:'InvoiceDate', displayName:'Date', width: '26%', headerCellClass: 'text-center'},
            {field:'StatusCode', displayName:'Status', visible: false }
        ]
    };
    $scope.gridOptions.columnDefs[4].cellFilter = 'date';
    $scope.gridOptions.multiSelect = true;

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.selectAll = function() {
        $scope.gridApi.selection.selectAllRows();
    };
    $scope.clearAll = function() {
        $scope.gridApi.selection.clearSelectedRows();
    };

    $scope.searchinfo = {};
    $scope.strSearchBy = 'Voucher No';
    $scope.filterStatus = false;
    $scope.fStatus = 'USE';
    $scope.searchBy = function(intOrder){
        if(intOrder == 0){
            $scope.strSearchBy = 'Voucher No';
        }else{
            $scope.strSearchBy = 'Vendor Name';
        }
    };
    $scope.search = function() {
        var strFilter = "";
        if($scope.searchinfo.strSearch != undefined && $scope.searchinfo.strSearch != ""){
            strFilter = "/" + $scope.strSearchBy.replace(/\s+/g,"") + "/" + $scope.searchinfo.strSearch;
        }
        strFilter = strFilter + "/" + $scope.fStatus
        var p = $http({
            method: "GET",
            url: strWebServiceURL + "/tables/plcp1" + strFilter
        });
        p.success(function(data){
            $scope.gridOptions.data = changeTedious2uiGridDT(data);
        });
        p.error(function(data){
            $scope.message = "Connect to WebService failed.";
        });
    };
    var watch = $scope.$watch("filterStatus",function(newValue,oldValue, scope) {
        if (newValue) {
            $scope.fStatus = "APP";
        } else {
            $scope.fStatus = "USE";
        }
        if (newValue != oldValue) {
            var strFilter = "";
            if($scope.searchinfo.strSearch != undefined && $scope.searchinfo.strSearch != ""){
                strFilter = "/" + $scope.strSearchBy.replace(/\s+/g,"") + "/" + $scope.searchinfo.strSearch;
            }
            strFilter = strFilter + "/" + $scope.fStatus
            var p = $http({
                method: "GET",
                url: strWebServiceURL + "/tables/plcp1" + strFilter
            });
            p.success(function (data) {
                $scope.gridOptions.data = changeTedious2uiGridDT(data);
            });
            p.error(function (data) {
                $scope.message = "Connect to WebService failed.";
            });
        }
    });

    $scope.updateSave = function(){
        var strTrxNo = "";
        var intLength = $scope.gridApi.selection.getSelectedRows().length;
        for (var i=0;i<intLength;i++){
            strTrxNo = strTrxNo + "," + $scope.gridApi.selection.getSelectedRows()[i].TrxNo;
        }
        if(strTrxNo.length>0){
            var p = $http.put(strWebServiceURL + "/tables/plcp1/" + strTrxNo.substring(1));
            p.success(function (data) {
                if (data.status == "success") {
                    $scope.message = data.status;
                    $scope.search();
                } else if (data.status == "failed") {
                    $scope.message = data.status + ". Please try again.";
                }
            });
            p.error(function (data) {
                $scope.message = "Connect to WebService failed.";
            });
        }else{
            $scope.message ="Please select at least one record!";
        }
    };
});


function changeTedious2uiGridDT(data){
    var arrayDT = [];
    var intRowCount = data.length;
    if(intRowCount>0){
        var intCols = data[0].length;
        for(var intRC=0;intRC<=intRowCount-1;intRC++){
            var objRows =  new Object;
            for(var intI=0;intI<=intCols-1;intI++){
                objRows[data[intRC][intI].key] = data[intRC][intI].value;
            }
            arrayDT.push(objRows);
        }
    }  
    return arrayDT;
}
           