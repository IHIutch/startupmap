<template>
  <router-view />
</template>

<static-query>
query App {
  metadata {
    siteName
    siteDescription
    siteUrl
  }
}
</static-query>

<script>
export default {
  name: "App",
  metaInfo() {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: "description",
          name: "description",
          content: this.$static.metadata.siteDescription
        }
      ]
    };
  }
};
</script>
