<html>
	<head>
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	    <meta content='main' name='layout' /> 
	    <title>Lease add</title>
	  	<g:javascript library='lease-add'/>
	</head>
	<body>
		<div id="virtual-machine-properties">
			<fieldset>
				<legend><g:message code="addLease.virtualMachineDetails"/></legend>
				<div id="vm-count-div">
					<table>
						<tr>
							<td>
								<g:message code="addLease.minimumInstancesCount"/>
							</td>
							<td>
								<select id="lease-minimum-instances">
						            <option value="1">1</option>
						            <option value="2">2</option>
						            <option value="3">3</option>
						            <option value="4">4</option>
						            <option value="5">5</option>
						            <option value="6">6</option>
						            <option value="7">7</option>
						            <option value="8">8</option>
						            <option value="9">9</option>
						            <option value="10">10</option>
					            </select>
							</td>
							<td>
								<g:message code="addLease.maximumInstancesCount"/>
							</td>
							<td>
								<select id="lease-maximum-instances">
				              		<option value="1">1</option>
				              		<option value="2">2</option>
				              		<option value="3">3</option>
				              		<option value="4">4</option>
				              		<option value="5">5</option>
				              		<option value="6">6</option>
				              		<option value="7">7</option>
				              		<option value="8">8</option>
				              		<option value="9">9</option>
				              		<option value="10">10</option>
				            	</select>
							</td>
						</tr>
					</table>
				</div>
				<div id="vm-hardware-div">
					<fieldset>
						<legend><g:message code="addLease.hardwareConfig"/></legend>						
						<table>
					        <tr>
					          <td>processorArchitecture</td>
					          <td>
					            <select id="vm-processor-architecture">
					              <option value="x86">x86</option>
					              <option value="x86_64">x86_64</option>
					            </select>
					          </td>
					        </tr>
					        <tr>
					          <td>processorVendor</td>
					          <td>
					            <select id="vm-processor-vendor">
					              <option value="Intel">Intel</option>
					              <option value="AMD">AMD</option>
					            </select>
					          </td>
					        </tr>
					        <tr>
					          <td>processorSpeed</td>
					          <td>
					            <select id="vm-processor-speed">
					              <option value="500">500 Mhz</option>
					              <option value="1000">1000 Mhz</option>
					              <option value="1500">1500 Mhz</option>
					              <option value="2000">2000 Mhz</option>
					              <option value="2500">2500 Mhz</option>
					              <option value="3000">3000 Mhz</option>
					            </select>
					          </td>
					        </tr>
					        <tr>
					          <td>numberOfCores</td>
					          <td>
					            <select id="vm-number-cores">
					              <option value="1">1</option>
					              <option value="2">2</option>
					              <option value="3">3</option>
					              <option value="4">4</option>
					              <option value="5">5</option>
					              <option value="6">6</option>
					            </select>
					          </td>
					        </tr>
					        <tr>
					          <td>memorySize</td>
					          <td>
					            <select id="vm-memory-size">
					              <option value="128">128 MB</option>
					              <option value="192">192 MB</option>
					              <option value="256">256 MB</option>
					              <option value="384">384 MB</option>
					              <option value="512">512 MB</option>
					              <option value="768">768 MB</option>
					              <option value="1024">1024 MB</option>
					              <option value="1536">1536 MB</option>
					              <option value="2048">2048 MB</option>
					            </select>
					          </td>
					        </tr>
					        <tr>
					          <td>storageCapacity</td>
					          <td>
					            <select id="vm-storage-capacity">
					              <option value="1">1 GB</option>
					              <option value="2">2 GB</option>
					              <option value="3">3 GB</option>
					              <option value="4">4 GB</option>
					              <option value="5">5 GB</option>
					              <option value="6">6 GB</option>
					              <option value="7">7 GB</option>
					              <option value="8">8 GB</option>
					              <option value="9">9 GB</option>
					              <option value="10">10 GB</option>
					            </select>
					          </td>
					        </tr>
					        <tr>
					          <td>networkBandwidth</td>
					          <td>
					            <select id="vm-network-bandwidth">
					              <option value="100">100</option>
					              <option value="1000">1000</option>
					            </select>
					          </td>
					        </tr>
						</table>
					</fieldset>
				</div>
				<div id="vm-software-div">
					<fieldset>
						<legend><g:message code="addLease.softwareConfig"/></legend>
						<table>
							<tr>
					          <td>templateName</td>
					          <td>
					            <select id="vm-template-name">
					              <option value="U_S_10_04_S">Ubuntu Server 10.04 Simple</option>
					              <option value="U_S_10_04_M">Ubuntu Server 10.04 + MySQL</option>
					            </select>
					          </td>
					        </tr>
					      </table>
					</fieldset>	
				</div>
				<div id="vm-preemptible-div">
					<table>
						<tr id="preemptible-row">
          					<td><g:message code="addLease.preemptible"/></td>
          					<td><input type="checkbox" id="lease-preemtible"/></td>
        				</tr>
        			</table>
				</div>
			</fieldset>
		</div>
		<div id="virtual-machine-time-properties">
			<fieldset>
				<legend><g:message code="addLease.time"/></legend>
				<table id="vm-start-end-time">
					<tr>
			          <td><g:message code="addLease.startVm"/></td>
			          <td>
						<input type="text" id="start-datepicker">
			            <input type="checkbox" id="lease-start-now"/>
			            <g:message code="addLease.rightNow"/>
			          </td>
			        </tr>
					<tr>
				    	<td><g:message code="addLease.stopVm"/></td>
				        <td>
				            <input type="text" id="end-datepicker">
				            <input type="checkbox" id="lease-end-infinite"/>
				            <g:message code="addLease.infinite"/>
				        </td>
				    </tr>
				</table>
			</fieldset>
		</div>
		<div id="virtual-machine-alocate">
			<input type="button" id="send-json" value="Alocate"/>
		</div>
		<div id="virtual-machine-alocate-output"></div>
		<div id="hidden-content" style="display:none">
        	<g:link id="add-link" url="[controller:'lease', action:'add']"/>
    	</div>
	</body>
</html>
