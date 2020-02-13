<template>
  <Layout>
    <b-container>
      <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <g-link class="navbar-brand" to="/">Buffalo Startup Map</g-link>
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <g-link class="nav-link btn btn-secondary small" to="/"
              >Cancel</g-link
            >
          </li>
        </ul>
      </nav>
      <b-row>
        <b-col class="col-md-6 offset-md-3 mt-5 pt-5 pb-4">
          <h1 class="mt-5">Add a Startup</h1>
          <p>
            Enter the business information to plot them on the Buffalo Startup
            Map!
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-md-6 offset-md-3">
          <b-form @submit.prevent="sendFormData" autocomplete="off">
            <b-form-group label="Company Name" label-for="company">
              <b-form-input
                id="company"
                v-model="form.company"
                required
                placeholder="Startup business name... "
                autofocus
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Company Address" label-for="autocomplete">
              <b-form-input
                autocomplete="off"
                name="donotautofill"
                type="search"
                id="autocomplete"
                required
                placeholder="Startup headquarters..."
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Website" label-for="website">
              <b-form-input
                id="website"
                v-model="form.website"
                required
                placeholder="Startup website... "
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Description" label-for="description">
              <b-form-textarea
                id="description"
                v-model="form.description"
                required
                placeholder="Briefly describe the startup..."
                rows="3"
                no-resize
              ></b-form-textarea>
            </b-form-group>

            <b-form-group label="Your Email" label-for="email">
              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="Best email for verification..."
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Your Name" label-for="name">
              <b-form-input
                id="name"
                v-model="form.name"
                required
                placeholder="First and last..."
              ></b-form-input>
            </b-form-group>
            <div class="text-center mb-5">
              <b-button type="submit" variant="primary" class="mt-3 mb-5"
                >Submit</b-button
              >
            </div>
          </b-form>
          <!-- <b-button @click="testJWT()"></b-button> -->
        </b-col>
      </b-row>
    </b-container>
  </Layout>
</template>

<script>
import VueScript2 from "vue-script2";

export default {
  metaInfo: {
    title: "About"
  },
  data() {
    return {
      url:
        "https://script.google.com/macros/s/AKfycbyvH8XfNF_skvR011XKIgKwSS25Ks5GsBWkpHSIzcsfaJ1MrW0/exec",
      form: {
        email: "",
        name: "",
        company: "",
        description: "",
        address: {},
        lng: "",
        lat: ""
      }
    };
  },
  methods: {
    sendFormData() {
      fetch(this.url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.dataToArray)
      }).then(() => {
        this.$router.push({
          path: "/thanks"
        });
      });
    },
    getAddressValues(autocomplete) {
      var place = autocomplete.getPlace();
      for (var i = 0; i < place.address_components.length; i++) {
        var key = place.address_components[i].types[0];
        this.form.address[key] = place.address_components[i].long_name;
        this.form.lat = place.geometry.location.lat();
        this.form.lng = place.geometry.location.lng();
      }
    },
    initAutocomplete() {
      var self = this;
      VueScript2.load(
        `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyC2tSkbaL8SIQsSQGlIsQZXn-wHBD3z-Rs"}&libraries=places`
      ).then(function() {
        var autocomplete = new google.maps.places.Autocomplete(
          document.getElementById("autocomplete"),
          { types: ["geocode"] }
        );
        autocomplete.setFields(["address_component", "geometry"]);
        autocomplete.addListener("place_changed", function() {
          self.getAddressValues(autocomplete);
        });
      });
    }
  },
  mounted() {
    this.initAutocomplete();
  },
  computed: {
    dataToArray() {
      return Object.keys(this.form).map(key =>
        key == "address" ? JSON.stringify(this.form[key]) : this.form[key]
      );
    }
  }
};
</script>
