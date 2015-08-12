// Use Moment to convert dates to acceptible format for Tableau
function dateToTableauDate(dateToConvert) {
	// Use moment
	var moDate = moment(dateToConvert).format("YYYY-MM-DD HH:mm:ss.SSS");
	
	return moDate;
}

$(document).ready(function() {
	$("#getDataButton").click(function() {
		var zipCode = $('#zipCode').val().trim();
		console.log("zipCode: " + zipCode);
		
		// If we have a Zipcode then set it as tableau connection data so we can use it later
		if(zipCode) {
			tableau.connectionData = zipCode;
			tableau.connectionName = "King County Inspection Data: " + zipCode;
		}
		
		tableau.submit();
	});
});

// -------------------------------------------------- //
// WDC-specific things
// -------------------------------------------------- //
var myConnector = tableau.makeConnector();

myConnector.init = function() {
	tableau.initCallback();
};


myConnector.getColumnHeaders = function() {
	var fieldNames = ['inspection_result', 'inspection_business_name', 'zip_code', 'inspection_score', 'inspection_type', 'violation_description', 'violation_record_id', 'inspection_closed_business', 'city', 'violation_type', 'inspection_date', 'inspection_serial_num', 'address', 'description', 'name', 'business_id', 'longitude', 'latitude', 'program_identifier', 'violation_points'];
    
	var fieldTypes = ['string', 'string', 'string', 'int', 'string', 'string', 'string', 'bool', 'string', 'string', 'datetime', 'string', 'string', 'string', 'string', 'string', 'float', 'float', 'string', 'int'];

  tableau.headersCallback(fieldNames, fieldTypes);
};

myConnector.getTableData = function() {
	var zipCode = tableau.connectionData;
	var url = 'https://data.kingcounty.gov/resource/f29f-zza5.json?zip_code=' + zipCode;
	
	$.getJSON(url, function(json, status, xhr) {
		if(json) {
			console.log('our json: ' + JSON.stringify(json));
			
			var i;
			var toRet = [];
			
			for(i = 0; i < json.length; i++) {
				var row = {
					"inspection_result" : json[i]["inspection_result"] || null,
					"inspection_business_name" : json[i]["inspection_business_name"] || null,
					"zip_code" : json[i]["zip_code"] || null,
					"inspection_score" : json[i]["inspection_score"] || null,
					"inspection_type" : json[i]["inspection_type"] || null,
					"violation_description" : json[i]["violation_description"] || null,
					"violation_record_id" : json[i]["violation_record_id"] || null,
					"inspection_closed_business" : json[i]["inspection_closed_business"] || null,
					"city" : json[i]["city"] || null,
					"violation_type" : json[i]["violation_type"] || null,
					"inspection_date" : dateToTableauDate(json[i]["inspection_date"]) || null,			// use a date format tableau knows
					"inspection_serial_num" : json[i]["inspection_serial_num"] || null,
					"address" : json[i]["address"] || null,
					"description" : json[i]["description"] || null,
					"name" : json[i]["name"] || null,
					"business_id" : json[i]["business_id"] || null,
					"longitude" : json[i]["longitude"] || null,
					"latitude" : json[i]["latitude"] || null,
					"program_identifier" : json[i]["program_identifier"] || null,
					"violation_points" : json[i]["violation_points"] || null,
										
				};
				
				toRet.push(row);
			}
			
			// call back to tableau with data
			tableau.dataCallback(toRet, toRet.length.toString(), false);
			
		} else {
			console.log('error: ' + xhr.responseText);
			tableau.abortWithError("error getting data");
		}
	}); 

};


tableau.registerConnector(myConnector);