var systemSpecs  = {
	
	sunHours : 4.5,	
	voltage : 24.0,				//Operating Voltage
	daysAutonomy : 3,			//Days the system can sustain itself
	
	totalPower : 400,
	totalACPower : 500,
	totalDCPower : 700,
	totalDCEnergy : 100,
	totalACEnergy : 50,
	
	getTotalEnergy : function() {
		
		return ((this.totalDCEnergy + (this.totalACEnergy/inverterSpecs.efficiency))/chargeSpecs.efficiency)		// Daily DC Energy
		
	}
	
};

var batterySpecs  = {

	voltage : 12.0,
	current : 1.0,
	discharge : 0.6,
	batteryCap : 4,
	
	getBatteryCapacity : function() {
		
		
		return systemSpecs.daysAutonomy * (systemSpecs.getTotalEnergy()/(chargeSpecs.voltage*this.discharge));
	
	},
	
	getNumSeries : function() {
		
		return Math.ceil(systemSpecs.voltage/this.voltage);
		
	},
	
	getNumParallel : function() {
		
		return Math.ceil(this.getBatteryCapacity()/this.batteryCap);
		
	}
	
};



var pvSpecs = {
	
	voltage : 12.0,			//Open Circuit Voltage
	current : 7.0,			//Short Circuit Current
	v_mpp : 12.0,
	i_mpp : 1.0,
	w_p : 12,
	
	getNumSeries : function() {
		
		return Math.ceil(systemSpecs.voltage/this.v_mpp)
	
	},
	
	getNumParallel : function() {
		
		var currentReq = systemSpecs.getTotalEnergy()/(systemSpecs.sunHours*chargeSpecs.voltage);		
		return Math.ceil(currentReq/this.i_mpp);
	
	},
	
	getTotalPanels : function() {
	
		return this.getNumParallel * this.getNumSeries;
	
	}
	
	
	
};

var inverterSpecs = {
	
	efficiency : 0.9,
	
	getPowerRating : function() {
		
		return (systemSpecs.totalACPower/this.efficiency);
		
	}
	
};

var chargeSpecs = {
	
	
	voltage : 24.0,
	mpptAble : true,
	efficiency : 0.9,
	
};

	




function initialize() {
	
	
	// Inputs

	systemSpecs.sunHours = parseFloat(document.getElementById("sh").value);
	systemSpecs.totalDCEnergy = parseFloat(document.getElementById("dce").value);
	systemSpecs.totalACEnergy = parseFloat(document.getElementById("ace").value);
	systemSpecs.totalDCPower = parseFloat(document.getElementById("dcp").value);
	systemSpecs.totalACPower = parseFloat(document.getElementById("acp").value);
	systemSpecs.daysAutonomy = parseInt(document.getElementById("doa").value);
	
	batterySpecs.batteryCap = parseFloat(document.getElementById("bat_cap").value);
	batterySpecs.voltage = parseFloat(document.getElementById("bat_v").value);
	batterySpecs.discharge = parseFloat(document.getElementById("bat_dod").value);
	
	
	pvSpecs.voltage = parseFloat(document.getElementById("pv_voc").value);
	pvSpecs.current = parseFloat(document.getElementById("pv_isc").value);
	pvSpecs.v_mpp = parseFloat(document.getElementById("pv_vmp").value);
	pvSpecs.i_mpp = parseFloat(document.getElementById("pv_imp").value);
	pvSpecs.w_p = parseFloat(document.getElementById("pvp").value);
	

	
	
	inverterSpecs.efficiency = parseFloat(document.getElementById("ie").value);
	
	
	chargeSpecs.efficiency = parseFloat(document.getElementById("ce").value);
	chargeSpecs.voltage = parseFloat(document.getElementById("cc_v").value);
	
	
	
	// Outputs
	document.getElementById("bs").value = batterySpecs.getNumSeries();
	document.getElementById("bp").value = batterySpecs.getNumParallel();
	document.getElementById("nompow").value = inverterSpecs.getPowerRating().toFixed(2);
	document.getElementById("ps").value = pvSpecs.getNumSeries();
	document.getElementById("pp").value = pvSpecs.getNumParallel();
	document.getElementById("cc_opt").value = chargeSpecs.voltage;
	document.getElementById("cc_vmaxout").value = pvSpecs.voltage*pvSpecs.getNumSeries().toFixed(2);
	document.getElementById("cc_imaxout").value = pvSpecs.current*pvSpecs.getNumParallel().toFixed(2);
	
	
	document.getElementById("bt").value = batterySpecs.getNumSeries()*batterySpecs.getNumParallel();
	document.getElementById("pt").value= pvSpecs.getNumSeries()*pvSpecs.getNumParallel();
	
	
	
}


function generate_table() {
  // get the reference for the body
  var body = document.getElementsByTagName("body")[0];
 
  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");
 
  // creating all cells
    // creates a table row
    var row = document.createElement("tr");
 
    for (var j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");
      var cellText = document.createTextNode("column "+j);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
 
    // add the row to the end of the table body
    tblBody.appendChild(row);
 
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "2");
}



