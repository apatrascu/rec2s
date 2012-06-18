$(document).ready(function(){

	$(".active").removeClass("active");
	$("#add-lease").addClass("active");
	
    /* ACTIONS */
    $("#lease-start-now").change(function(e){
    	var isChecked = $("#lease-start-now").is(":checked"); 
    	$("#start-datepicker").attr("disabled", isChecked);      
    	$("#start-datepicker").next().attr("disabled", isChecked);
    });

    $("#lease-end-infinite").change(function(e){
    	var isChecked = $("#lease-end-infinite").is(":checked");
    	$("#end-datepicker").attr("disabled", isChecked);
    	$("#end-datepicker").next().attr("disabled", isChecked);
    });

    $("#lease-minimum-instances").change(function(){
        //populez maximum cu valori din intervalul [min...10]
        var min = $(this).val();
        var option = "";
        for (i=min; i<=10; i++)
            option = option + '<option value="' + i +'">' + i +'</option>';
        $("#lease-maximum-instances").children().remove();
        $("#lease-maximum-instances").append(option);
    });
    
    
    //http://trentrichardson.com/examples/timepicker/
    var datepickerSeparator = ' @ ' ;
    var datepickerOpts = {
    		//datepicker
    	minDate: 0,    		
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 2,
		showButtonPanel: true,
		showOn: "button",
		showAnim: "fadeIn",
			//timepicker
		hourGrid: 4,
		minuteGrid: 10,
		timeFormat: 'hh:mm',
    	separator: datepickerSeparator
    };
    $("#start-datepicker").datetimepicker(datepickerOpts);
    $("#end-datepicker").datetimepicker(datepickerOpts);
    
    /* JSON & WS */
    var createTimestamp = function(opts) {    	
    	var date = $(opts.dateElement).datetimepicker("getDate");
    	if (date != null)
    		return date.getTime();
    	return "";
    };
    
    var getLeaseType = function() {
    	var preemtible =$("#lease-preemtible").is(":checked");
    	var urgent = $("#lease-start-now").is(":checked");
    	var leaseType = "ADVANCED_RESERVATION";
    	
    	if (preemtible) {
    		leaseType = "BEST_EFFORT";
    	}
    	if (urgent) {
    		leaseType = "URGENT";
    	}
    	
    	return leaseType;
    };

    var isDataValid = function() {
    	//check if start is selected 
    	if ($("#start-datepicker").val().length == 0) {
    		if (! $("#lease-start-now").is(":checked"))
    			return false;
    	}
    	
    	//check if end is selected
    	if ($("#end-datepicker").val().length == 0) {
    		if (! $("#lease-end-infinite").is(":checked"))
    			return false;
    	}	
    	
    	//check if end date is bigger that start date
    	/*
    	var start = parseInt(createTimestamp({dateElement:"#start-datepicker"}), 10);
    	var end = parseInt(createTimestamp({dateElement:"#end-datepicker"}), 10);
    	if (end <= start) {
    		return false;
    	}
    	*/
    	
    	return true;
    };

    $("#send-json").click(function(){
        if (isDataValid()) {
           var listJson = {
                "leaseStartTime" : createTimestamp({dateElement:"#start-datepicker"}),
                "leaseEndTime" : createTimestamp({dateElement:"#end-datepicker"}),
                "leaseType" : getLeaseType(),
                "leasePreemptible" : $("#lease-preemtible").is(":checked") + "",
                "minimumInstancesCount" : $("#lease-minimum-instances").val(),
                "maximumInstancesCount" : $("#lease-maximum-instances").val(),
                "processorArchitecture" : $("#vm-processor-architecture").val(),
                "processorVendor" : $("#vm-processor-vendor").val(),
                "processorSpeed" : $("#vm-processor-speed").val(),
                "numberOfCores" : $("#vm-number-cores").val(),
                "memorySize" : $("#vm-memory-size").val(),
                "storageCapacity" : $("#vm-storage-capacity").val(),
                "networkBandwidth" : $("#vm-network-bandwidth").val(),
                "templateName" : $("#vm-template-name").val()
            };

           	/*
           	//injectare directa in lease manager
            console.log(JSON.stringify(listJson));
           	var ip = '192.168.1.158';
           	var port = '8000';
            //$.base64.encode( "this is a test" ) returns "dGhpcyBpcyBhIHRlc3Q="
            //$.base64.decode( "dGhpcyBpcyBhIHRlc3Q=" ) returns "this is a test"

           	var url = "http://" + ip + ":" + port + "/addLease/" + $.base64.encode(JSON.stringify(listJson)); 
            $.get(url, function(response){
            	$("#output").html(response);            	
            });
            */
           
           	//console.log(JSON.stringify(listJson));
           	//var url = "/rec2s-gui/lease/adauga/?lease=" + $.base64.encode(JSON.stringify(listJson));
           	var url = "/rec2s-gui/lease/adauga/?lease=" + JSON.stringify(listJson);
           	$.post(url, function(response){
           		if (response == "granted") {
           			$("#virtual-machine-alocate-output").html("Lease added!");
           		}
            });
           
        }
    });
    
    
});