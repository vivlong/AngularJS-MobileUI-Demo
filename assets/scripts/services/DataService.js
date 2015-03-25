function GetAuthorizationTicket($scope, $http){
    var WebServiceUrl = "http://192.168.0.230/SysFreightWS/AuthWS.asmx?op=GetAuthorizationTicket";
    var soapMessage =
        '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> \
            <soap:Body> \
                <GetAuthorizationTicket xmlns="http://tempuri.org/"> \
                    <strResult>' + $scope.logininfo.strResult + '</strResult> \
                    <strCatalog>' + $scope.logininfo.strCatalog + '</strCatalog> \
                    <strUserName>' + $scope.logininfo.strUserName + '</strUserName> \
                    <strPassword>' + $scope.logininfo.strPassword + '</strPassword> \
                </GetAuthorizationTicket> \
            </soap:Body> \
        </soap:Envelope>';
    var result = null;
    $http({
        method: 'POST',
        url: WebServiceUrl,
        data: soapMessage,
        headers: {
            post: {'Content-Type': 'text/xml; charset=utf-8'}
        }
    }).success(function(data){
        if (!data.success) {
            alert('failed');
        } else {
            alert('success');
        }
    });
}