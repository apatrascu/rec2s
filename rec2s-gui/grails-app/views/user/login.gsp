<%@ page contentType="text/html;charset=ISO-8859-1"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<meta name="layout" content="main" />
		<title>Log in</title>
	</head>
	<body>
		<div id="index-content">
			<g:form name="loginForm" url="[controller:'user',action:'login']">
				<div>
					<g:message code="login.username"/>:
					<g:textField name="login" />
				</div>
				<div>
					<g:message code="login.password"/>:
					<g:passwordField name="password" />
				</div>
				<div>
					<g:submitButton name="submitLogin" value="Login"/>
				</div>
			</g:form>
	
		</div>
	</body>
</html>