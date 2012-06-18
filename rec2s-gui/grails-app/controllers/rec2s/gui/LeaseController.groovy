package rec2s.gui

import grails.converters.JSON

class LeaseController {

	def leaseManagerService
	
    def adauga = { 
		if(request.get) {
			render(view:"adauga")
		} else {
			def addLeasePackage = [
				user: session.authentication,
				lease: JSON.parse(params.lease),
				ip: message(code:"global.frontendIp"),
				port: message(code:"global.frontendPort")
			]
			def l = leaseManagerService.addlease(addLeasePackage)
			render l.access + ""
		}
    }
	
	def status = {
		def frontendPackage = [
			userId: session.authentication.details.id,
			ip: message(code:"global.frontendIp"),
			port: message(code:"global.frontendPort")
		]

		return [
			leaseManager: leaseManagerService.leaseManagerPending(frontendPackage).leases.collect() { lease -> JSON.parse(lease) },
			schedulerDelayable: leaseManagerService.schedulerDelayablePending(frontendPackage).leases,
			schedulerRunning: leaseManagerService.schedulerRunningPending(frontendPackage).leases
		]
	}
    
    
}
