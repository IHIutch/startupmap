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
                <span>{{ name }}</span>
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
              {{ point.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LPopup,
  LFeatureGroup
} from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

export default {
  metaInfo: {
    title: "Hello, world!"
  },
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
    LPopup,
    LFeatureGroup
  },
  data() {
    return {
      mapboxToken:
        "pk.eyJ1IjoiamJodXRjaCIsImEiOiJjamRqZGU1eTYxMTZlMzNvMjV2dGxzdG8wIn0.IAAk5wKeLXOUaQ4QYF3sEA",
      name: "",
      map: {
        center: [42.8864, -78.8784],
        points: [
          {
            name: "helm",
            lat: 42.88,
            lng: -78.878
          }
        ]
      }
    };
  }
};
</script>
