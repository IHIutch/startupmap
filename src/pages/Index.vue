<template>
  <Layout>
    <div class="container-fluid" style="height: 100vh;">
      <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <a class="navbar-brand" href="/">Buffalo Startup Map</a>
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <g-link class="nav-link btn btn-primary small" to="/about"
              >Add a Startup</g-link
            >
          </li>
        </ul>
      </nav>
      <div class="row h-100">
        <div class="col-12 h-100 px-0">
          <l-map
            class="h-100"
            :zoom="13"
            :center="map.center"
            :options="{ zoomControl: false }"
          >
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
                    {{ popup.company }}
                  </h2>
                  <h3 class="h6">
					{{ popup.autocomplete }}
                  </h3>
                  <p>{{ popup.description }}</p>
                  <ul>
                    <li>
                      <span class="label">Category:</span>
                      {{ popup.type }}
                    </li>
                    <li>
                      <span class="label">Stage:</span>
                      {{ popup.stage }}
                    </li>
                    
                    <li>
                      <button class="btn btn-sm btn-primary btn-text mt-3">
                        View
                      </button>
                    </li>
                  </ul>
                </div>
              </l-popup>
            </l-feature-group>
            <template v-for="(point, idx) in points">
              <l-circle-marker
                v-if="point.lat && point.lng"
                :key="idx"
                :lat-lng="[point.lat, point.lng]"
                :radius="10"
                :weight="0"
                :fillOpacity="0.7"
                fillColor="#0000EE"
                @click="markerClick(point)"
              />
            </template>
          </l-map>
        </div>
        <!--
        <div class="col-xs-12 col-md-4 listings">
          <ul class="list-group list-group-flush">
            <template v-for="(point, idx) in points">
              <li
                class="list-group-item"
                v-if="point.lat && point.lng"
                :key="idx"
              >
                <div>
                  <h2 class="h4 mb-1">
                    {{ point.company }}
                  </h2>
                  <h3 class="h6">
                    <div>
                      {{ point.address.street_number }}
                      {{ point.address.route }}
                    </div>
                    <div>
                      {{ point.address.locality }}
                      {{ point.address.administrative_area_level_1 }}
                      {{ point.address.postal_code }}
                    </div>
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
                      <button class="btn btn-sm btn-primary" href="#">
                        View
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </template>
          </ul>
        </div>
-->
        <!-- Listings column------>
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
    title: "Home"
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
    gtmTrackEvent(data) {
      this.$gtm.trackEvent({
        event: "mapPointClick",
        companyName: data.company
      });
    },
    markerClick(info) {
      this.popup = info;
      this.$refs.features.mapObject.openPopup([info.lat, info.lng]);
      this.gtmTrackEvent(info);
    }
  },
  computed: {
    points() {
      return this.$page.places.edges.map(place => {
        var node = place.node;
        return {
          name: node.name,
          type: "Design",
          description: node.description,
          lat: parseFloat(node.lat),
          lng: parseFloat(node.lng),
          company: node.company,
          address: JSON.parse(node.address)
        };
      });
    }
  }
};
</script>
