// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: "Buffalo Startup Map",
  siteUrl: "https://buffalostartupmap.com",
  // siteDescription: "This is a great description!",
  // icon: {
  //   favicon: "./src/assets/images/meta/favicon.png",
  //   touchicon: "./src/assets/images/meta/favicon.png"
  // },
  titleTemplate: "%s | Buffalo Startup Map",
  plugins: [
    {
      use: "gridsome-plugin-gtm",
      options: {
        id: "GTM-KDV75B3",
        enabled: process.env.NODE_ENV === "production" ? true : false,
        debug: false
      }
    },
    {
      use: "gridsome-source-google-sheets",
      options: {
        apiKey: "AIzaSyC2tSkbaL8SIQsSQGlIsQZXn-wHBD3z-Rs",
        spreadsheets: [
          {
            spreadsheetId: "14uU2zJQlJgU7zDniRZ7UUlIKvT4sT2lIWO-Zzo-hJmg",
            sheets: [
              {
                sheetName: "Sheet1",
                collectionName: "places"
              }
            ]
          }
        ]
      }
    }
  ]
};
