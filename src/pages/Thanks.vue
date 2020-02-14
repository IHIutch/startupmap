<template>
  <Layout>
    <b-container>
      <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <g-link class="navbar-brand" to="/">Buffalo Startup Map</g-link>
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <g-link class="nav-link btn btn-primary small" to="/"
              >View Map</g-link
            >
          </li>
        </ul>
      </nav>
      <b-row>
        <b-col class="col-md-6 offset-md-3 mt-5 pt-5 pb-4">
          <h1 class="mt-5">Push it forward.</h1>
          <br />
          <p>
            <b>BEFORE THE LISTING GOES LIVE</b> you must pass this link on to
            <b>10</b> of your peers. C'mon, give your plot an extra push! Share
            now, and come back tomorrow to boost your Buffalo Startup.
          </p>

          <a class="btn btn-primary mt-3 mr-2" href="#">Share The Map ...</a>
          <g-link class="btn btn-secondary mt-3" to="/about"
            >Add Another Startup</g-link
          >
          <p class="mt-5">
            <b>NOW IS THE TIME.</b> Some call our loyalty to one another based
            on the call as City of Good Neighbors. Some say it's BuffaLOVE. A
            comeback. A rising. However it motivates you, it's happening. Here.
            We're bringing it together each day and pushing it forward.
          </p>
          <br />

          <p>Let's be heard. Let's be counted. Let's go.</p>
        </b-col>
      </b-row>
    </b-container>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: "Thanks"
  }
};
</script>
