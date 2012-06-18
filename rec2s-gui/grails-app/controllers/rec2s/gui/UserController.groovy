package rec2s.gui

class UserController {

	def userService
	
    def index = { }
	
	def login = {
		if(request.get) { 
			render(view:"login") 
		} else {
			def loginPackage = [
				username: params.login,
				password: params.password,
				ip: message(code:"global.frontendIp"),
				port: message(code:"global.frontendPort")
			]
			def u = userService.login(loginPackage)
			if (u.access == "granted") {
				session.authentication = u
				redirect(uri: "/")
			} else {
				render(view:"login", model:[message: message(code:"login.badCredentials")])
			}
		}
	}
	
	def register = {
		if(request.get) {
			render(view:"register")
		} else {
			def registerPackage = [
				username: params.login,
				password: params.password,
				ip: message(code:"global.frontendIp"),
				port: message(code:"global.frontendPort")
			]
			def u = userService.register(registerPackage)
			if (u.access == "registered") {
				session.authentication = u
				redirect(uri: "/")
			} else {
				render(view:"login", model:[message: message(code:"register.badCredentials")])
			}
		}		
	}
	
	def logout = {
		session.authentication = null
		redirect(uri: "/")
	}
}
