<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<title>Rec2S</title>
		<g:javascript library='lib/jquery-1.6.4.min'/>
        <g:javascript library='lib/jquery-ui-1.8.16.custom.min'/>
        <g:javascript library='lib/jquery-ui-timepicker-addon'/>
        <g:javascript library='lib/jquery.simpletip-1.3.1'/>        
        <link rel="stylesheet" href="${resource(dir:'css',file:'rec2s.css')}" />
        <link rel="stylesheet" href="${resource(dir:'css',file:'start/jquery-ui-1.8.16.custom.css')}" />
        <link rel="stylesheet" href="${resource(dir:'css',file:'jquery-ui-timepicker-addon.css')}" />
        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />
        <g:layoutHead />
	</head>
	<body>
		<div id="teaser">
			<div class="wrap">
				<div id="image"></div>
				<div class="box">
					<h2>Welcome to <em title="rec2s">ReC<sup>2</sup>S</em></h2>
					<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis justo viverra nunc. Donec eu ipsum molestie eros condimentum malesuada. Sed quis velit vel augue sollicitudin aliquet. Quisque dignissim. Proin vehicula sem tempor velit. Pellentesque aliquam ante vitae pede. Nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis justo viverra nunc.</p>
				</div>
			</div>
		</div>
		
		<div id="header">
			<h1><a href="#"></a></h1>
			<ul id="menu">
				<li id="index" class="active"><a href="/rec2s-gui">index</a></li>
				<g:if test="${session.authentication != null}">										
					<li id="add-lease"><g:link class="cssMenui" url="[controller:'lease', action:'adauga']"><g:message code="menu.adaugaLease"/></g:link></li>
					<li id="status-lease"><g:link class="cssMenui" url="[controller:'lease', action:'status']"><g:message code="menu.statusLease"/></g:link></li>
					<li id="logout"><g:link class="cssMenui" url="[controller:'user', action:'logout']"><g:message code="menu.logout"/> ${session.authentication.request.username}</g:link></li>
				</g:if>
				<g:else>
					<li id="login"><g:link class="cssMenui" url="[controller:'user', action:'login']"><g:message code="menu.login"/></g:link></li>
					<li id="register"><g:link class="cssMenui" url="[controller:'user', action:'register']"><g:message code="menu.register"/></g:link></li>
				</g:else>
			</ul>
		</div>
	
		<div class="wrap">
			<g:layoutBody />
		</div>
			
		<div id="footer">
			<p>&copy; Copyright 2012 <a href="#">Alecsandru Patrascu</a> &middot; All Rights Reserved</p>
		</div>
	</body>

</html>