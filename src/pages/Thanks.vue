<template>
  <Layout>
    <b-container>
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
		<a class="navbar-brand" href="/">Buffalo Startup Map</a>
		<ul class="nav navbar-nav">
			<li class="nav-item">
				<a class="nav-link btn btn-primary small" href="/">View Map</a>
			</li>
		</ul>
	</nav>
    <b-row>
    	<b-col class="col-md-6 offset-md-3 mt-5 pt-5 pb-4">
    	<h1 class="mt-5">Thank You!</h1>
    	<p>See the listing you've added now. Shout! - and call your peers to list a company. The map team will review your submission for accuracy and clarity. </p>
		<a class="btn btn-primary mt-3 mr-2" href="/About/">Add Another Startup</a>
		<a class="btn btn-secondary mt-3" href="#">Share Your Plot ...</a>
    	</b-col>
    </b-row>
    <b-row>
	    <b-col class="col-md-6 offset-md-3 mt-5 pt-5 pb-4">
	    </b-col>
    </b-row>
      
    </b-container>
  </Layout>
</template>

<script>
import VueScript2 from "vue-script2";

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
