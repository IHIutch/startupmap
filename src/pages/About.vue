<template>
  <Layout>
    <b-container>
      <b-row>
        <b-col cols="6" offset="3">
          <b-form @submit.prevent="sendFormData">
            <b-form-group label="Email address:" label-for="email">
              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="Enter email"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Your Name:" label-for="name">
              <b-form-input
                id="name"
                v-model="form.name"
                required
                placeholder="Enter name"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Your Company:" label-for="company">
              <b-form-input
                id="name"
                v-model="form.company"
                required
                placeholder="Enter company name"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Your Description:" label-for="description">
              <b-form-textarea
                id="descrtiption"
                v-model="form.description"
                required
                placeholder="Describe your company"
                rows="3"
                no-resize
              ></b-form-textarea>
            </b-form-group>

            <b-form-group label="Your Address:" label-for="address">
              <b-form-input
                autocomplete="false"
                id="address"
                required
                placeholder="Your company's address"
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: "About us"
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
      var autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("address"),
        { types: ["geocode"] }
      );
      autocomplete.setFields(["address_component", "geometry"]);
      autocomplete.addListener("place_changed", function() {
        self.getAddressValues(autocomplete);
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
