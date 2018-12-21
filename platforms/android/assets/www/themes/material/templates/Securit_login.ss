<!DOCTYPE html>
<html>
  	<head>
  	<% base_tag %>
	<!-- start: Meta. No Base tag needed -->
			<meta itemscope itemtype="http://schema.org/Article" />
		<meta itemprop="headline" content="-melle.io-" />
		<meta itemprop="description" content="This is a website" />
		
		
		<!-- start: Meta. Tagz -->
		
		
		<title>-melle.io-</title>
		<link href='https://fonts.googleapis.com/css?family=Crimson+Text|Questrial' rel='stylesheet' type='text/css'>
	    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
	    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >	

	    <link rel="shortcut icon" type="image/x-icon" href="/themes/material/img/favicon.ico">
	    <link href="/themes/material/css/app.css" rel="stylesheet">
	    <link href="/themes/material/css/icomoon.css" rel="stylesheet">
	    <link href="/bower_components/angular-material/angular-material.min.css" rel="stylesheet" type="text/css"/>
	    <!-- style sheet -->
		<!-- module -->
		
    </head>
  	<body ng-app="materialApp">
  	
	<div layout="column" style="background-color: #f5f5f5">
		<div id="title" layout="column" layout-align="center center" layout-fill>
			<h1>admin</h1>
		</div>

		<div id="content" layout="row" layout-sm="column" layout-fill>
			<span flex flex-sm="5"></span>

			<md-content style="background-color: #fff !important;" class="md-whiteframe-z1" flex="65" flex-sm="80" layout="column" layout-margin layout-padding>
				$Cotent
				$Form
				<md-divider></md-divider>
			</md-content>

			<span flex hide-sm></span>

			<div flex="20" flex-sm="80" layout="column" layout-margin layout-padding style="background:#f6f6f6;border-left:1px solid #eee;border-right:1px solid #eee">
				<blockquote>Some profound meaning of life end of the ages quote here. </blockquote>

				<md-divider></md-divider>
				<div layout="row" layout-align="center start">
					<%-- <md-button class="md-icon-button" aria-label="publications">
				  	  	<md-tooltip md-direction="top">
					      Publications
					    </md-tooltip>
					    <md-icon md-font-icon="icon-my-library-books" ng-style="{'font-size': '20px','color':'#7C8F8C'}" ></md-icon>
				  	</md-button>
					  <md-button class="md-icon-button" ng-click="filter.show = true" aria-label="filter">
					  	<md-tooltip md-direction="top">
					      Download CV
					    </md-tooltip>
					    <md-icon md-font-icon="icon-school" ng-style="{'font-size': '20px','color':'#7C8F8C'}" ></md-icon>
					  </md-button>
					  <md-button class="md-icon-button" ng-click="filter.show = true" aria-label="filter">
					  	<md-tooltip md-direction="top">
					      Email me
					    </md-tooltip>
					    <md-icon md-font-icon="icon-email" ng-style="{'font-size': '20px','color':'#7C8F8C'}" ></md-icon>
					  </md-button>
					  <md-button class="md-icon-button" ng-click="filter.show = true" aria-label="filter">
					  	<md-tooltip md-direction="top">
					      My Profile
					    </md-tooltip>
					    <md-icon md-font-icon="icon-google" ng-style="{'font-size': '20px','color':'#7C8F8C'}" ></md-icon>
					  </md-button> --%>
				</div>
			</div>

			<span flex></span>
		</div>

		<div id="footer" layout="column" layout-align="center center" layout-fill>

			<p>&copy; melle.io</p>
		</div>

    </div>
    <!-- /wrapper -->
    
    	<script type="text/javascript" src="/bower_components/angular/angular.min.js"></script>
	    <script type="text/javascript" src="/bower_components/angular-animate/angular-animate.min.js"></script>
	    <script type="text/javascript" src="/bower_components/angular-aria/angular-aria.min.js"></script>
	    <script type="text/javascript" src="/bower_components/angular-material/angular-material.min.js"></script>
		<script src="/themes/material/js/main.js"></script>
	    
  </body>
</html>
