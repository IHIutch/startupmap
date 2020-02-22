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
          <b-form @submit.stop.prevent="sendFormData" autocomplete="off">
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
                ref="address"
                required
                placeholder="Startup headquarters..."
                :state="validation"
              ></b-form-input>
              <b-form-invalid-feedback :state="validation">
                Please select an address from the dropdown
              </b-form-invalid-feedback>
            </b-form-group>
            <div class="row">
              <div class="col-6">
                <b-form-group
                  id="category"
                  label="Category"
                  label-for="category"
                >
                  <b-form-input
                    id="category"
                    v-model="form.category"
                    placeholder="Ex: Healthcare ..."
                    required
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-6">
                <b-form-group label="Stage" label-for="stage">
                  <b-form-select
                    id="stage"
                    v-model="form.stage"
                    :options="stages"
                    required
                  >
                    <template v-slot:first>
                      <b-select-option :value="null" disabled=""
                        >-- Select a Stage --</b-select-option
                      >
                    </template>
                  </b-form-select>
                </b-form-group>
              </div>
            </div>
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
            <div class="text-center mb-5">
              <b-button
                type="submit"
                variant="primary"
                class="mt-3 mb-5"
                :disabled="loading"
              >
                <span v-if="loading">
                  <b-spinner small></b-spinner>
                  Saving...
                </span>
                <span v-else>Submit</span>
              </b-button>
              <p class="lightgrey">
                By clicking Submit you agree that the information listed above
                is true to the best of your knowledge. You're also saying it's
                cool if we email you. We won't spam you so don't worry, be
                happy. Now, submit your Startup already.
              </p>
              <br />
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScA9hirfSieN7Wii81gPZGP3_zvJAzg9K4Ye51MTT9M8-Ybmg/viewform?usp=sf_link"
                target="_blank"
              >
                Feedback?
              </a>
            </div>
          </b-form>
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
      validation: null,
      url:
        "https://script.google.com/macros/s/AKfycbyvH8XfNF_skvR011XKIgKwSS25Ks5GsBWkpHSIzcsfaJ1MrW0/exec",
      form: {
        email: "",
        company: "",
        description: "",
        address: {},
        lng: "",
        lat: "",
        stage: null,
        category: ""
      },
      stages: [
        "n/a",
        "Idea",
        "Seed",
        "Series A",
        "Series B",
        "Series C",
        "Series D",
        "Series E+"
      ],
      loading: false
    };
  },
  methods: {
    gtmTrackFormSubmit() {
      this.$gtm.trackEvent({
        event: "formSubmit",
        companyName: this.form.company,
        date: new Date()
      });
    },
    sendFormData() {
      this.gtmTrackFormSubmit();
      if (!Object.keys(this.form.address).length) {
        this.$refs.address.focus();
        // this.validation = false;
        return;
      }
      this.loading = true;
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
          self.validation = null;
        });
      });
    }
  },
  mounted() {
    let self = this;
    this.initAutocomplete();
    document
      .getElementById("autocomplete")
      .addEventListener("input", function() {
        self.form.address = {};
      });
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
