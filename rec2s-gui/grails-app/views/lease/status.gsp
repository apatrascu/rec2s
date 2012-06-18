<%@ page contentType="text/html;charset=ISO-8859-1"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<meta name="layout" content="main" />
		<title>Lease status</title>
		<g:javascript library='lease-status'/>
		
	</head>
	<body>
		<div id="index-content">
						
			<table class="fancy-table">
				<thead>
					<tr>
						<th>Lease type</th>
						<th>Lease preemtible</th>
						<th>Lease added on</th>
						<th>Lease status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<g:render template="templates/lease-manager" model="[
						lista: leaseManager,
						status: 'WAITING' 						
					]"/>
					<g:render template="templates/scheduler" model="[
						lista: schedulerDelayable,
						status: 'PENDING' 						
					]"/>
					<g:render template="templates/scheduler" model="[
						lista: schedulerRunning,
						status: 'RUNNING' 						
					]"/>
					
<%--					<g:each in="${leaseManager}" var="element" status="i">--%>
<%--						<tr>--%>
<%--							<td>${element.lease.leaseType}</td>--%>
<%--							<td>${element.lease.leasePreemptible}</td>--%>
<%--							<td>${new Date(element.added)}</td>--%>
<%--							<td>PENDING</td>--%>
<%--							<td>--%>
<%--								<div class="view-lease-details">--%>
<%--									<div style="display: none;">--%>
<%--										<table>--%>
<%--											<tbody>--%>
<%--												<tr><td>Minimum instances</td><td>${element.lease.minimumInstancesCount}</td></tr>--%>
<%--												<tr><td>Maximum instances</td><td>${element.lease.maximumInstancesCount}</td></tr>--%>
<%--												<tr><td>Processor architecture</td><td>${element.lease.processorArchitecture}</td></tr>--%>
<%--												<tr><td>Processor vendor</td><td>${element.lease.processorVendor}</td></tr>--%>
<%--												<tr><td>Processor speed</td><td>${element.lease.processorSpeed} Mhz</td></tr>--%>
<%--												<tr><td>Number of cores</td><td>${element.lease.numberOfCores}</td></tr>--%>
<%--												<tr><td>Memory size</td><td>${element.lease.memorySize} MB</td></tr>--%>
<%--												<tr><td>Storage</td><td>${element.lease.storageCapacity} GB</td></tr>--%>
<%--												<tr><td>Network</td><td>${element.lease.networkBandwidth} Mbps</td></tr>--%>
<%--												<tr><td>Template</td><td>${element.lease.templateName}</td></tr>--%>
<%--											</tbody>--%>
<%--										</table>--%>
<%--									</div>--%>
<%--								</div>--%>
<%--							</td>					--%>
<%--						</tr>--%>
<%--					</g:each>					--%>
				</tbody>
			</table>
			
<%--			<p>scheduler delayable</p>--%>
<%--			<g:each in="${schedulerDelayable}">--%>
<%--				<p>${it.lease.lease.processorVendor}</p>--%>
<%--				<p>${it.lease.credentials.details.id}</p>--%>
<%--			</g:each>	--%>
<%--			--%>
<%--			<p>scheduler running</p>--%>
<%--			<g:each in="${schedulerRunning}">--%>
<%--				<p>${it.lease.lease.processorVendor}</p>--%>
<%--				<p>${it.lease.credentials.details.id}</p>--%>
<%--			</g:each>--%>
		</div>
	</body>
</html>