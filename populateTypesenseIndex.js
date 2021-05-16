/* eslint-disable */

// Start Typesense server with `npm run typesenseServer`
// Then run `npm run populateTypesenseIndex` or `node populateTypesenseIndex.js`

const Typesense = require('typesense');

module.exports = (async () => {
  const typesense = new Typesense.Client({
    nodes: [
      {
        host: 'localhost',
        port: '8108',
        protocol: 'http',
      },
    ],
    apiKey: 'qxipcap',
  });

  const schema = {
	 "name": "pcap",
              "fields": [
                {"name": "timestamp", "type": "auto" },
                {"name": "no_", "type": "auto" },
                {"name": "time", "type": "auto" },
                {"name": "source", "type": "string" },
                {"name": "destination", "type": "string" },
                {"name": "length", "type": "auto" },
                {"name": "protocol", "type": "string", "facet": true },
                {"name": "info", "type": "string", "facet": true }
              ]
  };

  console.log('Populating PCAP index in Typesense');

  try {
    await typesense.collections('pcap').delete();
    console.log('Deleting existing collection: pcap');
  } catch (error) {
    // Do nothing
  }

  console.log('Creating schema: ');
  console.log(JSON.stringify(schema, null, 2));
  await typesense.collections().create(schema);

  console.log('Adding records: ');
  const pcap = require('./data/pcap.json');
  try {
    const returnData = await typesense
      .collections('pcap')
      .documents()
      .import(pcap);
    console.log(returnData);
    console.log('Done indexing.');

    const failedItems = returnData.filter(item => item.success === false);
    if (failedItems.length > 0) {
      throw new Error(
        `Error indexing items ${JSON.stringify(failedItems, null, 2)}`
      );
    }

    return returnData;
  } catch (error) {
    console.log(error);
  }
})();
