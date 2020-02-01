<template>
  <Layout>
    <b-container>
      <b-row>
        <b-col cols="6" offset="3">
          <b-form @submit.prevent="onSubmit">
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
        name: ""
      }
    };
  },
  methods: {
    onSubmit() {
      fetch(this.url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.dataToArray)
      });
    }
  },
  computed: {
    dataToArray() {
      return Object.keys(this.form).map(key => this.form[key]);
    }
  }
};
</script>
