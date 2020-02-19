<html class="jnm">
<head>
  <meta charset="utf-8">
  <title>Activiteiten-Spreidings-Kaart</title>
  <link rel="stylesheet" href="vendor/leaflet/leaflet.css"/>
  <script src="vendor/leaflet/leaflet.js"></script>
  <script src="vendor/jquery-3.3.1.min.js"></script>

  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script src='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.3.1/leaflet-omnivore.min.js'></script>

  <script src="scripts/tools.js"></script>
  <script src="scripts/ActiviteitenLayer.js"></script>
  <script src="scripts/Geocoder.js"></script>
  <script src="scripts/LokalenLayer.js"></script>

  <script src="scripts/FilterSettings.js"></script>
  <script src="scripts/RenderMap.js"></script>
 
  <link rel="stylesheet" href="/common/jnm-theme-for-tools.css"/>
  <link rel="stylesheet" href="css/jnm_heat.css"/>
</head>
<body>

  <?php include_once($_SERVER['DOCUMENT_ROOT']."/common/analyticstracking.php") ?>



  <table id="controls" align="left">
  <tr><td><h1>Activiteiten-Spreidings-Kaart (ASK)</h1></td></tr>
  <tr><td>Op deze kaart staan de kernen van onze actieve afdelingen. Door op een kern te klikken, kan je zien op welke plaatsen de afdeling het voorbije jaar activiteiten organiseerde.</td></tr>
  <tr><td>Als je je inschrijft via <a href="https://www.jnm.be/lidworden">JNM.be/lidworden</a> word je automatisch lid van de meest dichtbije afdeling. Word je liever lid van een andere afdeling dan deze waar je automatisch bij hoort en/ of word je graag lid van een tweede afdeling? Stuur dan en mailtje aan <a href="mailto:info@jnm.be">info@jnm.be</a> zodat we dat in orde kunnen brengen.</td></tr>
  <tr><td>JNM probeert steeds nieuwe kernen (afdelingen) op te richten om op meer plaatsen aanwezig te zijn. Vind je geen kern die activiteiten organiseert in jouw buurt en heb je zin om daar samen met ons verandering in brengen? Mail dan naar <a href="mailto:info@jnm.be">info@jnm.be</a> zodat we samen kunnen bekijken hoe we dat aanpakken.</td></tr>
  <tr><td><br/></td></tr>
  <tr><td><button onclick="selectAll(true);">Selecteer alles</button><button onclick="selectAll(false);">Deselecteer Alles</button></td></tr>
  <tr><td><button onclick="loadAllLayers()">Toon alle activiteiten</button></td></tr>
  <tr><td><div id="layerControls" style="display: flex; flex-wrap: wrap;"></div></td></tr>
  <tr><td><br/></td></tr>
  <tr><td></td></tr>
  </table>

  <input type="checkbox" id="toonklasieke_afdelingsgrenzen" onchange="ShowAfdelingsGrenzen()"/> Toon klasieke afdeling grenzen.

<table>
  <tr>
    <td>
      <table style="height: 500px">
        <tr style="vertical-align: top;"><td>
          <h3 id="geselecteerde_afdeling_title" style="display: none;">Geselecteerd:</h3>
          <div id="geselecteerde_afdeling_tekstje"></div>
          <br/>
          <div id="geselecteerde_activiteit_tekstje"></div>
        </td></tr>
        <tr style="vertical-align: bottom;"><td>

          <div class="legende_box">
            Legende:<br/>
            <img class="legende" src="img/GeoCenter.png"> Kern van een afdeling<br/>
            <img class="legende" src="img/Lokaal.png"> Lokaal<br/>
            <img class="legendeBondssec" src="img/Bondssec.png">Bondssecretariaat JNM<br/>
            <img class="legende" src="img/Act.png"> Activiteit<br/>
          </div>

        </td></tr>
      </table>
    </td>
    <td style="width: 100%"><div id="map" style="height: 500px"></div></td>
  </tr>
</table>
  

  <table border="1">
    <tr><td>Activiteiten worden getoond als ze minstens <input type="text" id="min_act_duration" placeholder="0"/> uren duren</td></tr>
    <tr><td>Activiteiten worden getoond als ze maximaal <input type="text" id="max_act_duration" placeholder="0"/> uren duren</td></tr>
    <tr><td>Activiteit moet beginnen achter <input type="text" id="datepicker_after"></td></tr>
    <tr><td>Activiteit moet beginnen voor <input type="text" id="datepicker_before"></td></tr>
    <tr><td>Categorie van de activiteit is <input type="text" id="cat_picker">(%, algemeen, natuur, milieu, beheer, werkstudie, 15-18 jarigen) </td></tr>
    <tr><td>Aantal activiteiten per locatie voor rendering<input type="text" id="min_act"></td></tr>

    <tr><td><button id="reloadSettingsButton" onclick="renderAnalysis(getFilterSettings());">Apply filter</button></td></tr>
  </table>



  <script>
    console.log("Getting started...");
    initFilterSettings();
    initializeMap();
    renderAnalysis(getFilterSettings());
    var kmlLayer = omnivore.kml('Afdelingen_JNM.kml')
    function ShowAfdelingsGrenzen()
    {
      var b = toonklasieke_afdelingsgrenzen.checked;
      if(b)
        kmlLayer.addTo(map);
      else
        kmlLayer.removeFrom(map);
    }
  </script>








<table>
<tr><td>
<br /><br />
<h2>Hoe een activiteit toevoegen op deze kaart?</h2>

Maak een nieuwe activiteit aan op de JNM-site. De kaart update automatisch.

<h2>Ik wil enkel kampen</h2>

Gebruik hiervoor de 'minimale lengte'.


<h2> Hoe een afdelingslokaal toevoegen?</h2>

<ol>
<li>Ga naar <a href="https://openstreetmap.org" target="_blank">openstreetmap.org</a></li>
<li>Ga naar de locatie van je nieuwe lokaal</li>
<li>Klik edit (indien nodig: maak een account of log in)</li>
<li>Klik op 'point' linksvanboven en klik op de locatie van je lokaal</li>
<li>Zoek links voor 'club'</li>
<li>Vul de nodige gevens in.
  <ul>
  <li>Bij 'name' in: 'JNM Afdeling' </li>
  <li>Bij 'type' vul je 'youth_movement' in</li>
  <li>Vul bij 'address' zoveel mogelijk in. De 'unit' is het busnummer, eventueel laat je dit blanco</li>
  <li>Hours laat je blanco - wij hebben géén vaste openingsuren</li>
  <li>Bij 'add field' kun je ook nog email en website aanvullen. Gebruik geen persoonlijke emailadressen, want die vervallen na een paar jaar. afdeling@jnm.be kan natuurlijk wel</li>
  </ul>


<li>Klik onderaan 'all tags' open en voeg daar nog een veld 'operator' met waarde 'JNM' toe ('JNM' in hoofdletters) <a href="img/EditHelp.png" target="_blank">(dit ziet er zo uit)</a></li>
<li>Voor eventuele afkortingen mag je ook nog 'alt_name' en 'alt_name_1' gebruiken. Bv: 'name'='JNM Noordwest-Brabant', 'alt_name'='JNM NWB', 'alt_name'='JNM NoordWestBraband'. Zo vinden zoekmachines alle opties.</li> 
<li>Klik opslaan, geef een nuttige boodschap (zoals 'Toevoegen JNMlokaal')</li>
<li>Klik 'uploaden'</li>
<li>Ten slotte moet je ook de cache op de JNM-site nog updaten. Wacht een paar minuten en klik dan hier: <a href="https://tools.jnm.be/jnm_heat/cache_lokalen.php" target="_blank">update cache</a>
<li>Klaar! Een minuutje later zou deze kaart ook up-to-date moeten zijn. Als bonus kan elke goeie GPS-app die op OSM-gebaseerd is (OSMAND, Maps.me) je lokaal nu vinden</li>
</ol>

Hou er rekening mee dat deze gegevens door iedereen kunnen worden aangepast! Je hoeft dus geen OSM-account door te geven aan de volgende voorzitter - hou die maar zelf.

<h2>Wil je ook een feature toevoegen?</h2>
<a href='http://github.com/pietervdvn/JNMHeat' target='_blank'>Patches welcome!</a>

</td>
</tr>
<tr><td><br/></td></tr>
<tr><td>Gemaakt door Pieter Vander Vennet en Emile Sonneveld</td></tr>

</table>
</body>
</html>
