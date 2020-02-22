<template>
  <Layout>
    <div class="container-fluid vh-100">
      <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <g-link class="navbar-brand" href="/">Buffalo Startup Map</g-link>
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
            :zoom="12"
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
                    <span v-if="Object.keys(popup).length">
                      {{ popup.address.street_number }}
                      {{ popup.address.route }}
                      <sup class="ml-1">
                        <span>({{ filteredPoints.length }})</span>
                      </sup>
                    </span>
                  </h2>
                </div>
              </l-popup>
            </l-feature-group>
            <template v-for="(point, idx) in points">
              <l-circle-marker
                v-if="point.lat && point.lng"
                :key="idx"
                :lat-lng="[point.lat, point.lng]"
                :radius="11"
                :weight="0"
                :fillOpacity="0.6"
                fillColor="#0000EE"
                @click="markerClick(point)"
              />
            </template>
          </l-map>
        </div>
        <div class="col-xs-12 col-md-4 listings">
          <ul class="list-group list-group-flush">
            <template v-for="(point, idx) in filteredPoints">
              <li
                class="list-group-item"
                v-if="point.lat && point.lng"
                :key="idx"
              >
                <div>
                  <h2 class="h4 mb-1">
                    {{ point.company }}
                  </h2>
                  <h3 class="h6 mt-1 mb-2">
                    <div>
                      {{ point.description }}
                    </div>
                  </h3>
                  <ul>
                    <li>
                      <span class="label">Type:</span>
                      {{ point.category }}
                    </li>
                    <li>
                      <span class="label">Stage:</span>
                      {{ point.stage }}
                    </li>
                    <li>
                     <a
                        class="btn btn-sm btn-primary fixed-bottom-right"
                        :href="point.website"
                        target="_blank"
                      >View</a>
                    </li>
                  </ul>
                </div>
              </li>
            </template>
          </ul>
        </div>
        <!-- Listings column------>
      </div>
    </div>
    <a class="linkfixed" href="https://www.helmux.com/work" target="_blank"
      >Built with &#x2665;</a
    >
  </Layout>
</template>

<page-query>
query {
  places: allPlaces {
    edges {
      node {
        id,
        email,
        company,
        description,
        address,
        lng,
        lat,
        stage,
        category,
        website
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
    title: "Home",
    titleTemplate: "Buffalo Startup Map"
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
      filteredPoints: {},
      map: {
        center: [42.8964, -78.846804]
      }
    };
  },
  methods: {
    markerClick(info) {
      this.$gtm.trackEvent({
        event: "mapPointClick",
        companyName: info.company
      });
      this.popup = info;
      this.filteredPoints = this.points.filter(point => {
        return point.lng == info.lng && point.lat == info.lat;
      });
      this.$refs.features.mapObject.openPopup([info.lat, info.lng]);
    }
  },
  computed: {
    points() {
      return this.$page.places.edges.map(place => {
        var node = place.node;
        return {
          description: node.description,
          lat: parseFloat(node.lat),
          lng: parseFloat(node.lng),
          company: node.company,
          category: node.category,
          stage: node.stage,
          address: JSON.parse(node.address),
          website: new RegExp("^https?://").test(node.website)
            ? node.website
            : "http://" + node.website
        };
      });
    }
  }
};
</script>
