<template>
  <Layout>
    <div class="container-fluid" style="height: 100vh;">
      <div class="row h-100">
        <div class="col-12 h-100 px-0">
          <l-map class="h-100" :zoom="13" :center="map.center">
            <l-tile-layer
              :url="
                'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=' +
                  mapboxToken
              "
            ></l-tile-layer>
            <l-feature-group ref="features">
              <l-popup>
                <div>
                  <h2 class="h4 mb-1">
	                  Helm Experience & Design
<!--                     {{ popup.company }} -->
                  </h2>
                  <h3 class="h6">
<!-- 	                  {{ popup.description }} -->

				  	640 Ellicott St. Buffalo NY 140203
                  </h3>
                  <ul>
	                  <li>
		                  <span class="label">Ind:</span>	                  
	                      {{ popup.type }}
	                   </li>
	                  <li>
		                  <span class="label">Est:</span>
		                  2010
	                  </li>
	                  <li>
		                  <span class="label">Size:</span>
		                  10
	                  </li>
	                  <li>
	                  	<button class="btn btn-sm btn-text">View</button>
	                  </li>
                  </ul>
                  
                </div>
              </l-popup>
            </l-feature-group>
            <l-circle-marker
              v-for="(point, idx) in points"
              :key="idx"
              :lat-lng="[point.lat, point.lng]"
              :radius="5"
              :weight="0"
              :fillOpacity="1"
              fillColor="red"
              @click="markerClick(point)"
            />
          </l-map>
        </div>
        <div class="col-xs-12 col-md-4 listings">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="(point, idx) in points"
              :key="idx"
            >
              <div>
	            <h2 class="h4 mb-1">
					{{ point.company }}
                  </h2>
                  <h3 class="h6">
<!-- 	                  {{ point.description }} -->

				  	640 Ellicott St. Buffalo NY 140203
                  </h3>
                  <ul>
	                  <li>
		                  <span class="label">Ind:</span>	                  
	                      {{ point.type }}
	                   </li>
	                  <li>
		                  <span class="label">Est:</span>
		                  2010
	                  </li>
	                  <li>
		                  <span class="label">Size:</span>
		                  10
	                  </li>
	                  <li>
	                  	<button class="btn btn-sm btn-primary" href="#">View</button>
	                  </li>
                  </ul>
  
                <h2 class="h4 mb-1">
                 
                </h2>
              </div>
            </li>
            
            
            
            
            
            
            
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query {
  places: allPlaces {
    edges {
      node {
        id,
        name,
        address,
        company,
        lng,
        lat,
        description,
        email
      }
    }
  }
}
</page-query>

<script>
let Vue2Leaflet = {};

if (process.isClient) {
  Vue2Leaflet = require("vue2-leaflet");
}

import "leaflet/dist/leaflet.css";

export default {
  metaInfo: {
    title: "Hello, world!"
  },
  components: {
    LMap: Vue2Leaflet.LMap,
    LTileLayer: Vue2Leaflet.LTileLayer,
    LCircleMarker: Vue2Leaflet.LCircleMarker,
    LPopup: Vue2Leaflet.LPopup,
    LFeatureGroup: Vue2Leaflet.LFeatureGroup
  },
  data() {
    return {
      mapboxToken:
        "pk.eyJ1IjoiamJodXRjaCIsImEiOiJjamRqZGU1eTYxMTZlMzNvMjV2dGxzdG8wIn0.IAAk5wKeLXOUaQ4QYF3sEA",
      popup: {},
      map: {
        center: [42.8864, -78.8784]
      }
    };
  },
  methods: {
    markerClick(info) {
      this.popup = info;
      this.$refs.features.mapObject.openPopup([info.lat, info.lng]);
    }
  },
  computed: {
    points() {
      var arr = [];
      this.$page.places.edges.forEach(place => {
        var tmp = place.node;
        arr.push({
          name: tmp.name,
          type: "Design",
          description: tmp.description,
          lat: parseFloat(tmp.lat),
          lng: parseFloat(tmp.lng),
          company: tmp.company,
          address: JSON.parse(tmp.address)
        });
      });
      return arr;
    }
  }
};
</script>
