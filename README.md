<img src="https://github.com/lmangani/typesense-pcap-demo/blob/main/favicon.png?raw=true" width=100 />

# typesense-pcap-demo

[Typesense](https://typesense.org/) + Tshark PCAP = Magic!

## Requirements
- nodejs 12.x+
- docker
- tshark

### Start Typesense
Run a Typesense instance using `docker`
```sh
$ npm install
$ npm run typesenseServer
```

Configure your server and collection settings using the `.env` file


### Import PCAP Dataset
Create & Import custom PCAP data/schema using `tshark` _(ek json)_
```sh
$ tshark -T ek -j "port 22" -P -V -x -c 100 | sed '/^{"index/d' > data/pcap.json
$ npm run populateTypesenseIndex
```

### Start App
Bootstrap your Application
```sh
$ npm start
```
Browse to http://localhost:3000 to search and view your PCAP data.

![image](https://user-images.githubusercontent.com/1423657/118392484-46603280-b63a-11eb-9d4a-8a1f643c631e.png)



