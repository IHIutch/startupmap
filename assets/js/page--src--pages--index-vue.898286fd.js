(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{iyQ6:function(t,e,s){"use strict";s.r(e);s("HnD3"),s("eaQ4"),s("waGA"),s("iwDs"),s("pOfs"),s("HlrW"),s("csNf"),s("bMVF");var a=s("GUe+"),l=s("w+YJ");let i={};i=s("uz8j");var r={metaInfo:{title:"Home",titleTemplate:"Buffalo Startup Map"},components:{LMap:i.LMap,LTileLayer:i.LTileLayer,LCircleMarker:i.LCircleMarker,LPopup:i.LPopup,LFeatureGroup:i.LFeatureGroup,BButton:a.a,BFormCheckbox:l.a},data:()=>({mapboxToken:"pk.eyJ1IjoiamJodXRjaCIsImEiOiJjamRqZGU1eTYxMTZlMzNvMjV2dGxzdG8wIn0.IAAk5wKeLXOUaQ4QYF3sEA",popup:{},searchQuery:"",selectedTypes:[],selectedStages:[],showTypeFilter:!1,showStageFilter:!1,map:{center:[42.8964,-78.846804]},selectedMarker:null}),methods:{markerClick(t){this.$gtm.trackEvent({event:"mapPointClick",companyName:t.company}),this.popup=t,this.selectedMarker=t,this.filteredPoints=this.points.filter(e=>e.lng===t.lng&&e.lat===t.lat),this.$refs.features.mapObject.openPopup([t.lat,t.lng])},clearSearch(){this.searchQuery=""},toggleTypeFilter(){this.showTypeFilter=!this.showTypeFilter,this.showStageFilter=!1},toggleStageFilter(){this.showStageFilter=!this.showStageFilter,this.showTypeFilter=!1},clearFilters(t){"type"===t?this.selectedTypes=[]:"stage"===t&&(this.selectedStages=[])},showAllPoints(){this.popup={},this.filteredPoints=this.points,this.selectedMarker=null},getFillColor(t){return this.selectedMarker&&this.selectedMarker.lat===t.lat&&this.selectedMarker.lng===t.lng?"#ee00ff":"#0000EE"}},computed:{points(){return this.$page.places.edges.map(t=>{var e=t.node;return{description:e.description,lat:parseFloat(e.lat),lng:parseFloat(e.lng),company:e.company,category:e.category,stage:e.stage,address:JSON.parse(e.address),website:e.website.startsWith("http")?e.website:"http://"+e.website}})},uniqueTypes(){return[...new Set(this.points.map(t=>t.category))].sort()},uniqueStages(){return[...new Set(this.points.map(t=>t.stage))]},filteredPoints(){return this.points.filter(t=>{const e=t.company.toLowerCase().includes(this.searchQuery.toLowerCase())||t.description.toLowerCase().includes(this.searchQuery.toLowerCase())||t.category.toLowerCase().includes(this.searchQuery.toLowerCase())||t.stage.toLowerCase().includes(this.searchQuery.toLowerCase()),s=void 0===this.popup.lat||t.lat===this.popup.lat&&t.lng===this.popup.lng,a=0===this.selectedTypes.length||this.selectedTypes.includes(t.category),l=0===this.selectedStages.length||this.selectedStages.includes(t.stage);return e&&s&&a&&l})}}},n=s("KHd+"),o=null,c=Object(n.a)(r,(function(){var t=this,e=t._self._c;return e("Layout",[e("div",{staticClass:"container-fluid vh-100"},[e("nav",{staticClass:"navbar navbar-expand-sm navbar-light bg-light"},[e("g-link",{staticClass:"navbar-brand",attrs:{href:"/"}},[t._v("Buffalo Startup Map")]),e("ul",{staticClass:"nav navbar-nav"},[e("li",{staticClass:"nav-item"},[e("g-link",{staticClass:"nav-link btn btn-primary small",attrs:{to:"/about"}},[t._v("Add Startup")])],1)])],1),e("div",{staticClass:"row h-100"},[e("div",{staticClass:"col-12 h-100 px-0"},[e("div",{staticClass:"filter-buttons"},[e("b-button",{class:{selected:t.showTypeFilter},attrs:{variant:"sm"},on:{click:t.toggleTypeFilter}},[t._v("\n            Types ("+t._s(t.selectedTypes.length)+")\n          ")]),e("b-button",{class:{selected:t.showStageFilter},attrs:{variant:"sm"},on:{click:t.toggleStageFilter}},[t._v("\n            Stages ("+t._s(t.selectedStages.length)+")\n          ")]),e("div",{staticClass:"input-group mb-3"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.searchQuery,expression:"searchQuery"}],staticClass:"form-control",attrs:{type:"text",placeholder:"Filter & Search Buffalo Startups..."},domProps:{value:t.searchQuery},on:{input:function(e){e.target.composing||(t.searchQuery=e.target.value)}}}),e("div",{staticClass:"input-group-append"},[t.searchQuery?e("button",{staticClass:"btn",attrs:{type:"button"},on:{click:t.clearSearch}},[t._v("\n                ×\n              ")]):t._e()])])],1),e("div",{staticClass:"filters mb-3"},[e("div",{staticClass:"filter-options",class:{"d-none":!t.showTypeFilter}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-12"},[e("h3",[t._v("Types")]),e("button",{staticClass:"btn btn-link",on:{click:function(e){return t.clearFilters("type")}}},[t._v("\n                  [ Clear All Types ]\n                ")])]),t._l(t.uniqueTypes,(function(s){return e("div",{key:s,staticClass:"col-4"},[e("b-form-checkbox",{attrs:{value:s},model:{value:t.selectedTypes,callback:function(e){t.selectedTypes=e},expression:"selectedTypes"}},[t._v(t._s(s))])],1)}))],2)]),e("div",{staticClass:"filter-options",class:{"d-none":!t.showStageFilter}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-12"},[e("h3",[t._v("Stages")]),e("button",{staticClass:"btn btn-link",on:{click:function(e){return t.clearFilters("stage")}}},[t._v("\n                  [ Clear All Stages]\n                ")])]),t._l(t.uniqueStages,(function(s){return e("div",{key:s,staticClass:"col-6"},[e("b-form-checkbox",{attrs:{value:s},model:{value:t.selectedStages,callback:function(e){t.selectedStages=e},expression:"selectedStages"}},[t._v(t._s(s))])],1)}))],2)])]),e("l-map",{staticClass:"h-100",attrs:{zoom:12,center:t.map.center,options:{zoomControl:!1}}},[e("l-tile-layer",{attrs:{url:"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token="+t.mapboxToken}}),e("l-feature-group",{ref:"features"},[e("l-popup",[e("div",[e("h2",{staticClass:"h4 mb-1"},[Object.keys(t.popup).length?e("span",[t._v("\n                    "+t._s(t.popup.address.street_number)+"\n                    "+t._s(t.popup.address.route)+"\n                    "),e("sup",{staticClass:"ml-1"},[e("span",[t._v("("+t._s(t.filteredPoints.length)+")")])])]):t._e()])])])],1),t._l(t.points,(function(s,a){return[s.lat&&s.lng?e("l-circle-marker",{key:s.company,attrs:{"lat-lng":[s.lat,s.lng],radius:11,weight:0,fillOpacity:.6,fillColor:t.getFillColor(s)},on:{click:function(e){return t.markerClick(s)}}}):t._e()]}))],2)],1),e("div",{staticClass:"col-xs-12 col-md-4 listings"},[e("ul",{staticClass:"list-group list-group-flush"},[t._l(t.filteredPoints,(function(s,a){return[s.lat&&s.lng?e("li",{key:s.company,staticClass:"list-group-item"},[e("div",[e("h2",{staticClass:"h4 mb-1"},[t._v("\n                  "+t._s(s.company)+"\n                ")]),e("h3",{staticClass:"h6 mt-1 mb-2"},[e("div",[t._v("\n                    "+t._s(s.description)+"\n                  ")])]),e("ul",[e("li",[e("span",{staticClass:"label"},[t._v("Type:")]),t._v("\n                    "+t._s(s.category)+"\n                  ")]),e("li",[e("span",{staticClass:"label"},[t._v("Stage:")]),t._v("\n                    "+t._s(s.stage)+"\n                  ")]),e("li",[e("a",{staticClass:"btn btn-sm btn-primary fixed-bottom-right",attrs:{href:s.website,target:"_blank"}},[t._v("View")])])])])]):t._e()]}))],2),e("button",{staticClass:"btn btn-sm white full-width",on:{click:t.showAllPoints}},[t._v("\n          Show All\n        ")])])])]),e("a",{staticClass:"linkfixed",attrs:{href:"https://www.helmux.com/",target:"_blank"}},[t._v("Built with ♥")])])}),[],!1,null,null,null);"function"==typeof o&&o(c);e.default=c.exports}}]);