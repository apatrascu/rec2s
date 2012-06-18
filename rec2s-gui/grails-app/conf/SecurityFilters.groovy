class SecurityFilters {
    def filters = {
        loginCheck(controller:'*', action:'*') {
            before = {
				if (actionName == null && controllerName == null)
					return true
                if(!session.authentication && controllerName != "user" && actionName!="login" ) {
                    redirect(controller:"user",action:"login")
                    return false
                }
            }
       }
    }
}
