<template>
  <Layout>
    <div class="container-fluid vh-100">
      <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <g-link class="navbar-brand" href="/">Buffalo Startup Map</g-link>
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <g-link class="nav-link btn btn-primary small" to="/about">Add Startup</g-link>
          </li>
        </ul>
      </nav>
      <div class="row h-100">
        <div class="col-12 h-100 px-0">
          <div class="filter-buttons">
            <b-button :class="{ selected: showTypeFilter }" variant="sm" @click="toggleTypeFilter">
              Types ({{ selectedTypes.length }})
            </b-button>
            <b-button :class="{ selected: showStageFilter }" variant="sm" @click="toggleStageFilter">
              Stages ({{ selectedStages.length }})
            </b-button>

            <div class="input-group mb-3">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Filter & Search Buffalo Startups..."
                class="form-control"
              />
              <div class="input-group-append">
                <button
                  class="btn"
                  type="button"
                  @click="clearSearch"
                  v-if="searchQuery"
                >
                  &times;
                </button>
              </div>
            </div>

          </div>
          <!-- Filters -->
          <div class="filters mb-3">
            
            <div :class="{ 'd-none': !showTypeFilter }" class="filter-options">
              <div class="row">
                <div class="col-12">
                  <h3>Types</h3>
                  <button @click="clearFilters('type')" class="btn btn-link">[ Clear All Types ]</button>
                </div>
                <div class="col-4" v-for="type in uniqueTypes" :key="type">
                  <b-form-checkbox :value="type" v-model="selectedTypes">{{ type }}</b-form-checkbox>
                </div>
              </div>
            </div>
            <div :class="{ 'd-none': !showStageFilter }" class="filter-options">
              <div class="row">
                <div class="col-12">
                  <h3>Stages</h3>
                  <button @click="clearFilters('stage')" class="btn btn-link">[ Clear All Stages]</button>
                </div>
                <div class="col-6" v-for="stage in uniqueStages" :key="stage">
                  <b-form-checkbox :value="stage" v-model="selectedStages">{{ stage }}</b-form-checkbox>
                </div>
              </div>
            </div>
          </div>
          <!-- Map component -->
          <l-map
            class="h-100"
            :zoom="12"
            :center="map.center"
            :options="{ zoomControl: false }"
          >
            <l-tile-layer
              :url="'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=' + mapboxToken"
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
                :key="point.company"
                :lat-lng="[point.lat, point.lng]"
                :radius="11"
                :weight="0"
                :fillOpacity="0.6"
                :fillColor="getFillColor(point)"
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
          <button @click="showAllPoints" class="btn btn-sm white full-width">Show All</button>

        </div>
      </div>
    </div>
    <a class="linkfixed" href="https://www.helmux.com/" target="_blank">Built with &#x2665;</a>
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
import { BButton, BFormCheckbox } from "bootstrap-vue";

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
    LFeatureGroup: Vue2Leaflet.LFeatureGroup,
    BButton,
    BFormCheckbox
  },
  data() {
    return {
      mapboxToken: "pk.eyJ1IjoiamJodXRjaCIsImEiOiJjamRqZGU1eTYxMTZlMzNvMjV2dGxzdG8wIn0.IAAk5wKeLXOUaQ4QYF3sEA",
      popup: {},
      searchQuery: "",
      selectedTypes: [],
      selectedStages: [],
      showTypeFilter: false,
      showStageFilter: false,
      map: {
        center: [42.8964, -78.846804]
      },
      selectedMarker: null
    };
  },
  methods: {
    markerClick(info) {
      this.$gtm.trackEvent({
        event: "mapPointClick",
        companyName: info.company
      });
      this.popup = info;
      this.selectedMarker = info; // Set the selected marker
      this.filteredPoints = this.points.filter(point => {
        return point.lng === info.lng && point.lat === info.lat;
      });
      this.$refs.features.mapObject.openPopup([info.lat, info.lng]);
    },
    clearSearch() {
      this.searchQuery = "";
    },
    toggleTypeFilter() {
      this.showTypeFilter = !this.showTypeFilter;
      this.showStageFilter = false; // Ensure only one filter is open at a time
    },
    toggleStageFilter() {
      this.showStageFilter = !this.showStageFilter;
      this.showTypeFilter = false; // Ensure only one filter is open at a time
    },
    clearFilters(filterType) {
      if (filterType === 'type') {
        this.selectedTypes = [];
      } else if (filterType === 'stage') {
        this.selectedStages = [];
      }
    },
    showAllPoints() {
      this.popup = {};
      this.filteredPoints = this.points; // Reset to show all points
      this.selectedMarker = null; // Reset the selected marker
    },
    getFillColor(point) {
      // Change fill color if the point is the selected marker
      return this.selectedMarker && this.selectedMarker.lat === point.lat && this.selectedMarker.lng === point.lng
        ? "#ee00ff" //  color for selected marker
        : "#0000EE"; // Default color
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  },
  computed: {
    points() {
      const shuffledPoints = this.$page.places.edges.map(place => {
        var node = place.node;
        return {
          description: node.description,
          lat: parseFloat(node.lat),
          lng: parseFloat(node.lng),
          company: node.company,
          category: node.category,
          stage: node.stage,
          address: JSON.parse(node.address),
          website: node.website.startsWith("http")
            ? node.website
            : "http://" + node.website
        };
      });
      return this.shuffleArray(shuffledPoints);
    },
    uniqueTypes() {
      return [...new Set(this.points.map(point => point.category))].sort();
    },
    uniqueStages() {
      return [...new Set(this.points.map(point => point.stage))];
    },
    filteredPoints() {
      return this.points.filter(point => {
        const matchesSearch = (
          point.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          point.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          point.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          point.stage.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        const matchesLocation = (
          this.popup.lat === undefined || 
          (point.lat === this.popup.lat && point.lng === this.popup.lng)
        );
        const matchesType = this.selectedTypes.length === 0 || this.selectedTypes.includes(point.category);
        const matchesStage = this.selectedStages.length === 0 || this.selectedStages.includes(point.stage);
        return matchesSearch && matchesLocation && matchesType && matchesStage;
      });
    }
  }
};
</script>

