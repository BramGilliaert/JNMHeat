<html>
<head>
  <meta charset="utf-8">
  <title>In je buurt</title>
  <link rel="stylesheet" href="vendor/leaflet/leaflet.css"/>
  <script src="vendor/leaflet/leaflet.js"></script>
  <script src="vendor/jquery-3.3.1.min.js"></script>

  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  
  <script src="scripts/tools.js"></script>
  <script src="scripts/ActiviteitenLayer.js"></script>
  <script src="scripts/Geocoder.js"></script>
  <script src="scripts/LokalenLayer.js"></script>

  <script src="scripts/FilterSettings.js"></script>
  <script src="scripts/RenderMap.js"></script>
 
  <style>
    #map{ width: 1500px; height: 1050; }
  </style>
</head>
<body>

	<div id="map"></div>

	<script>
		initializeMap();
		renderPublic();
	</script>

</body>
</html>