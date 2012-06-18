package rec2s.services

import grails.converters.JSON

class UserService {

    static transactional = true

    def login = { loginPackage ->
		def authenticationRequest = [
			username: loginPackage.username,
			password: loginPackage.password 
		]
		def json = authenticationRequest as JSON
		def base64Request = json.toString().bytes.encodeBase64().toString()
		def url = "http://" + loginPackage.ip + ":" + loginPackage.port + "/authenticate/" + base64Request 
		
		def base64Response = new URL(url).getText()
		def authenticationResponse = JSON.parse(new String(base64Response.decodeBase64()))	
		
		return authenticationResponse
	}
	
	def register = { registerPackage ->
		def registrationRequest = [
			username: registerPackage.username,
			password: registerPackage.password
		]
		def json = registrationRequest as JSON
		def base64Request = json.toString().bytes.encodeBase64().toString()
		def url = "http://" + registerPackage.ip + ":" + registerPackage.port + "/register/" + base64Request
		
		def base64Response = new URL(url).getText()
		def registrationResponse = JSON.parse(new String(base64Response.decodeBase64()))
		
		return registrationResponse
	}
}	
