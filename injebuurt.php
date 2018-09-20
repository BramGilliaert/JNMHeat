<html>
<head>
  <meta charset="utf-8">
  <title>In je buurt</title>
  <link rel="stylesheet" href="vendor/leaflet/leaflet.css"/>
  <script src="vendor/leaflet/leaflet.js"></script>
  <script src="vendor/jquery-3.3.1.min.js"></script>

  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  
  <script src="scripts/tools.js"></script>
  <script src="scripts/ActiviteitenLayer.js"></script>
  <script src="scripts/Geocoder.js"></script>
  <script src="scripts/LokalenLayer.js"></script>

  <script src="scripts/FilterSettings.js"></script>
  <script src="scripts/RenderMap.js"></script>
 
  <link rel="stylesheet" href="/common/jnm-theme-for-tools.css"/>
  <link rel="stylesheet" href="css/jnm_heat.css"/>
</head>
<body onresize="OnResized()">
<?php include_once($_SERVER['DOCUMENT_ROOT']."/common/analyticstracking.php") ?>

<table>
  <tr>
    <td>
      <table style="height: 500px" id="table_with_map">
        <tr style="vertical-align: top;"><td>
          <h3 id="geselecteerde_afdeling_title" style="display: none;">Geselecteerd:</h3>
          <div id="geselecteerde_afdeling_tekstje"></div>
          <br/>
          <div id="geselecteerde_activiteit_tekstje"></div>
        </td></tr>
        <tr style="vertical-align: bottom;"><td>

          <div style="background-color: #ffffffc9; min-width: 300px;">
            Legende:<br/>
            <img class="legende" src="img/cloud_filled.png"> Geometrisch centrum van de activiteiten in België<br/>
            <img class="legende" src="img/Lokaal.png"> Lokaal<br/>
            <img class="legende" src="img/VoorbijeAct.png"> Voorbije activiteit<br/>
            <img class="legende" src="img/ToekomstAct.png"> Opkomende activiteit<br/>
          </div>

        </td></tr>
      </table>
    </td>
    <td style="width: 100%"><div id="map" style="height: 500px"></div></td>
  </tr>
</table>


<script>
  var mapElem = document.getElementById("map");
  initializeMap();
  renderPublic();
  var table_with_map = document.getElementById("table_with_map");
  function OnResized() {
    var h = window.innerHeight - 2;
    table_with_map.style.height = h + "px";
    mapElem.style.height = h + "px";
  }
  OnResized();
</script>

</body>
</html>
