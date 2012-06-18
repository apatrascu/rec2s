<g:each in="${lista}" var="element" status="i">
	<tr>
		<td>${element.lease.lease.leaseType}</td>
		<td>${element.lease.lease.leasePreemptible}</td>
		<td>${new Date(element.lease.added)}</td>
		<td>${status}</td>
		<td>
			<div class="view-lease-details">
				<div style="display: none;">
					<table>
						<tbody>
							<tr><td>Minimum instances</td><td>${element.lease.lease.minimumInstancesCount}</td></tr>
							<tr><td>Maximum instances</td><td>${element.lease.lease.maximumInstancesCount}</td></tr>
							<tr><td>Processor architecture</td><td>${element.lease.lease.processorArchitecture}</td></tr>
							<tr><td>Processor vendor</td><td>${element.lease.lease.processorVendor}</td></tr>
							<tr><td>Processor speed</td><td>${element.lease.lease.processorSpeed} Mhz</td></tr>
							<tr><td>Number of cores</td><td>${element.lease.lease.numberOfCores}</td></tr>
							<tr><td>Memory size</td><td>${element.lease.lease.memorySize} MB</td></tr>
							<tr><td>Storage</td><td>${element.lease.lease.storageCapacity} GB</td></tr>
							<tr><td>Network</td><td>${element.lease.lease.networkBandwidth} Mbps</td></tr>
							<tr><td>Template</td><td>${element.lease.lease.templateName}</td></tr>
						</tbody>
					</table>
				</div>
			</div>
		</td>					
	</tr>
</g:each>	