/* global instantsearch */

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import JSONFormatter from 'json-formatter-js'

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: process.env.TYPESENSE_SEARCH_ONLY_API_KEY, // Be sure to use an API key that only allows searches, in production
    nodes: [
      {
        host: process.env.TYPESENSE_HOST || 'localhost',
        port: process.env.TYPESENSE_PORT || '8108',
        protocol: process.env.TYPESENSE_PROTOCOL || 'http',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  //  filterBy is managed and overridden by InstantSearch.js. To set it, you want to use one of the filter widgets like refinementList or use the `configure` widget.
  additionalSearchParameters: {
    queryBy: 'protocol,source,destination',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const search = instantsearch({
  searchClient,
  indexName: 'pcap',
});

// Custom render

// Create the render function
const renderHits = (renderOptions, isFirstRender) => {
  const { hits, widgetParams } = renderOptions;

  widgetParams.container.innerHTML = `
    <table class="packet_list" style="width: 100%; table-layout: fixed; text-align: left;">
    <thead id="packet_list_header_fake"><tr><th style="width: auto;">Time</th><th style="width: 5%;">Id</th><th style="width: 10%;">Diff</th><th style="width: 15%;">Source</th><th style="width: 15%;">Destination</th><th style="width: 8%;">Protocol</th><th style="width: 5%;">Length</th><th style="width: auto;">Info</th></tr></thead>
    <tbody id="packet_list_frames">
      ${hits
        .map(
          item =>
            `<tr style="background-color: rgb(231, 230, 255); color: rgb(18, 39, 46);" onclick="toggleRow('${item.no_}')"><td>${item.ts}</td><td><a href="#" onclick="toggleRow('${item.no_}')">${item.no_}</a></td><td>${item.time}</td><td>${item.source}</td><td>${item.destination}</td><td>${item.protocol}</td><td>${item.length}</td><td>${item.info}</td>
            </tr><tr style="display: none;"  id="${item.no_}"><td>${item.expand}</td></tr>`
        )
        .join('')}
    </table>
  `;
};

const toggleRow = function(row){
	console.log('toggle row',row);
	var line = document.getElementById(row);
	line.style.display = (line.style.display === "none") ? "block" : "none";
}
window.toggleRow = toggleRow;

// Create the custom widget
const customHits = instantsearch.connectors.connectHits(renderHits);


// Search Widget
search.addWidgets([
  instantsearch.widgets.hits({
    container: '#hits',
    transformItems(items) {
      return items.map(item => ({ ...item, ts: new Date(parseInt(item.timestamp)).toUTCString(), expand: new JSONFormatter(item.layers).render().outerHTML }))
    }
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 15,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
  customHits({
    container: document.querySelector('#hits'),
  }),
]);

search.start();


/*
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <div class="hit-name">
            {{source}} -> {{destination}}
          </div>
          <div class="hit-authors">
            {{ info }}
          </div>
          <div class="hit-publication-year">{{timestamp}}</div>
          <div class="hit-rating">{{protocol}}</div>
        </div>
      `,
    },
    transformItems(items) {
      return items.map(item => ({
      ...item,
      ts: parseInt(item.timestamp),
    }));
  },
  }),
*/
