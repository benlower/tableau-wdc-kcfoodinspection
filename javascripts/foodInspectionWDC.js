      (function () {	
      // -------------------------------------------------- //
      // WDC-specific things
      // -------------------------------------------------- //
      var myConnector = tableau.makeConnector();
    
      myConnector.init = function () {
        tableau.initCallback();
      };
    
    
      myConnector.getColumnHeaders = function () {
		  tableau.log('getColumnHeaders...');
        var fieldNames = ['inspection_result', 'inspection_business_name', 'zip_code', 'inspection_score', 'inspection_type', 'violation_description', 'violation_record_id', 'inspection_closed_business', 'city', 'violation_type', 'inspection_date', 'inspection_serial_num', 'address', 'description', 'name', 'business_id', 'longitude', 'latitude', 'program_identifier', 'violation_points'];
    
        var fieldTypes = ['string', 'string', 'string', 'int', 'string', 'string', 'string', 'bool', 'string', 'string', 'datetime', 'string', 'string', 'string', 'string', 'string', 'float', 'float', 'string', 'int'];
    
        tableau.headersCallback(fieldNames, fieldTypes);
      };
    
      myConnector.getTableData = function () {
        var zipCode = tableau.connectionData;
        var url = 'https://data.kingcounty.gov/resource/f29f-zza5.json?zip_code=' + zipCode;
    
        tableau.log('about to call ' + url);
        
        $.getJSON(
          url,
          function (data, status) {
            tableau.log("Data received!");

            if (data) {
              var i;
              var toRet = [];

              for (i = 0; i < data.length; i++) {
                var row = {
                  "inspection_result": data[i]["inspection_result"] || null,
                  "inspection_business_name": data[i]["inspection_business_name"] || null,
                  "zip_code": data[i]["zip_code"] || null,
                  "inspection_score": data[i]["inspection_score"] || null,
                  "inspection_type": data[i]["inspection_type"] || null,
                  "violation_description": data[i]["violation_description"] || null,
                  "violation_record_id": data[i]["violation_record_id"] || null,
                  "inspection_closed_business": data[i]["inspection_closed_business"] || null,
                  "city": data[i]["city"] || null,
                  "violation_type": data[i]["violation_type"] || null,
                  "inspection_date": dateToTableauDate(data[i]["inspection_date"]) || null,			// use a date format tableau knows
                  "inspection_serial_num": data[i]["inspection_serial_num"] || null,
                  "address": data[i]["address"] || null,
                  "description": data[i]["description"] || null,
                  "name": data[i]["name"] || null,
                  "business_id": data[i]["business_id"] || null,
                  "longitude": data[i]["longitude"] || null,
                  "latitude": data[i]["latitude"] || null,
                  "program_identifier": data[i]["program_identifier"] || null,
                  "violation_points": data[i]["violation_points"] || null
                };

                toRet.push(row);
                
              }
            
              // Call back to tableau with the table data and the new record number (this is stored as a string)
              tableau.dataCallback(toRet, toRet.length.toString(), false);
            }
          }
          );
        // $.ajax({
        //   url: url,
        //   dataType: 'text',
        //   success: function (data) {
        //     if (data) {
        //       console.log('data: ' + data);
        //     

        //     } else {
        //       tableau.abortWithError("No results found for ticker symbol: " + ticker);
        //     }
        //   },
        //   error: function (xhr, ajaxOptions, thrownError) {
        //     // add something to the log and return an empty set if there was problem with the connection
        //     tableau.log("connection error: " + xhr.responseText + "\n" + thrownError);
        //     tableau.abortWithError("error connecting to the data source");
        //   }
        // });
    
      };
    
      myConnector.setZipCode = function (zipCode) {
        tableau.log("setting zip code to " + zipCode);
        tableau.connectionData = zipCode;
        tableau.connectionName = "King County Inspection Data: " + zipCode;
      };
    
      tableau.registerConnector(myConnector);
      
      // Use Moment to convert dates to acceptible format for Tableau
      function dateToTableauDate(dateToConvert) {
        // Use moment
        var moDate = moment(dateToConvert).format("YYYY-MM-DD HH:mm:ss.SSS");
    
        return moDate;
      }
    
      $(document).ready(function () {
        $("#getDataButton").click(function () {
          console.log('button click');
          var zipCode = $('#zipCode').val().trim();
          tableau.log('zip code ' + zipCode);
          
          // If we have a Zipcode then set it as tableau connection data so we can use it later
          if (zipCode) {
            myConnector.setZipCode(zipCode);
            tableau.log('before calling submit().  tableau.phase: ' + tableau.phase);
            tableau.submit();
          }
        });
      });
    })();