package rec2s.services

import grails.converters.JSON

class LeaseManagerService {

    static transactional = true

    def addlease = { addLeasePackage ->
		def addLeaseRequest = [
			credentials: addLeasePackage.user,
			lease: addLeasePackage.lease
		]
		return sendRequestToServer(addLeaseRequest, addLeasePackage.ip, addLeasePackage.port, "addLease")
    }
	
	
	def leaseManagerPending = { leaseManagerPackage ->		
		def leaseManagerPendingRequest = [
			userId: leaseManagerPackage.userId
		]
		return sendRequestToServer(leaseManagerPendingRequest, leaseManagerPackage.ip, leaseManagerPackage.port, "pendingLeaseManager")
	}
	
	def schedulerDelayablePending = { schedulerPackage ->
		def schedulerPendingRequest = [
			userId: schedulerPackage.userId
		]
		return sendRequestToServer(schedulerPendingRequest, schedulerPackage.ip, schedulerPackage.port, "pendingSchedulerDelayable")
	}
	
	def schedulerRunningPending = { schedulerPackage ->
		def schedulerPendingRequest = [
			userId: schedulerPackage.userId
		]
		return sendRequestToServer(schedulerPendingRequest, schedulerPackage.ip, schedulerPackage.port, "pendingSchedulerRunning")
	}
	
	
	private def sendRequestToServer = { req, ip, port, path ->
		def json = req as JSON
		def base64Request = json.toString().bytes.encodeBase64().toString()
		def url = "http://" + ip + ":" + port + "/" + path + "/" + base64Request
		
		def base64Response = new URL(url).getText()
		def resp = JSON.parse(new String(base64Response.decodeBase64()))
		
		return resp
	}
}
