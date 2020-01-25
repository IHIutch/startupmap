<template>
  <Layout>
    <div class="container-fluid" style="height: 100vh;">
      <div class="row h-100">
        <div class="col-9 h-100 px-0">
          <l-map class="h-100" :zoom="12" :center="map.center">
            <l-tile-layer
              :url="
                'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=' +
                  mapboxToken
              "
            ></l-tile-layer>
            <l-feature-group ref="features">
              <l-popup>
                <div>
                  <h2 class="h5 mb-1">
                    {{ popup.name }}
                  </h2>
                  <div class="mb-1">
                    <span class="text-muted small font-weight-bold">
                      {{ popup.type }}</span
                    >
                  </div>
                  <p class="small my-0">{{ popup.description }}</p>
                </div>
              </l-popup>
            </l-feature-group>
            <l-circle-marker
              v-for="(point, idx) in map.points"
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
        <div class="col-3">
          <h1>Businesses</h1>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="(point, idx) in map.points"
              :key="idx"
            >
              <div>
                <h2 class="h4 mb-1">
                  {{ point.name }}
                </h2>
                <div class="mb-1">
                  <span class="text-muted small font-weight-bold">
                    {{ point.type }}</span
                  >
                </div>
                <p class="small">{{ point.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>

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
        center: [42.8864, -78.8784],
        points: [
          {
            name: "Helm",
            type: "Design",
            description:
              "Through design-thinking and transparent processes, we deliver software that gets results. On-screen interactions are ongoing and emotionally involving. We'll help you reduce risk, learn continuously, and delight customers.",
            lat: 42.896338,
            lng: -78.868961
          }
        ]
      }
    };
  },
  methods: {
    markerClick(info) {
      this.popup = info;
      this.$refs.features.mapObject.openPopup([info.lat, info.lng]);
    }
  }
};
</script>
