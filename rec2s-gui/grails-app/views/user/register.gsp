<%@ page contentType="text/html;charset=ISO-8859-1"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<meta name="layout" content="main" />
		<title>Register</title>
	</head>
	<body>
		<div id="index-content">
			<g:form name="loginForm" url="[controller:'user',action:'register']">
				<div>
					<g:message code="register.username"/>:
					<g:textField name="login" />
				</div>
				<div>
					<g:message code="register.password"/>:
					<g:passwordField name="password" />
				</div>
				<div>
					<g:submitButton name="submitRegister" value="Register" />
				</div>
			</g:form>
	
		</div>
	</body>
</html>