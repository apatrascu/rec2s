<g:each in="${lista}" var="element" status="i">
	<tr>
		<td>${element.lease.leaseType}</td>
		<td>${element.lease.leasePreemptible}</td>
		<td>${new Date(element.added)}</td>
		<td>${status}</td>
		<td>
			<div class="view-lease-details">
				<div style="display: none;">
					<table>
						<tbody>
							<tr><td>Minimum instances</td><td>${element.lease.minimumInstancesCount}</td></tr>
							<tr><td>Maximum instances</td><td>${element.lease.maximumInstancesCount}</td></tr>
							<tr><td>Processor architecture</td><td>${element.lease.processorArchitecture}</td></tr>
							<tr><td>Processor vendor</td><td>${element.lease.processorVendor}</td></tr>
							<tr><td>Processor speed</td><td>${element.lease.processorSpeed} Mhz</td></tr>
							<tr><td>Number of cores</td><td>${element.lease.numberOfCores}</td></tr>
							<tr><td>Memory size</td><td>${element.lease.memorySize} MB</td></tr>
							<tr><td>Storage</td><td>${element.lease.storageCapacity} GB</td></tr>
							<tr><td>Network</td><td>${element.lease.networkBandwidth} Mbps</td></tr>
							<tr><td>Template</td><td>${element.lease.templateName}</td></tr>
						</tbody>
					</table>
				</div>
			</div>
		</td>					
	</tr>
</g:each>	