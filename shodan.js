var ShodanClient = require('shodan-client'),
    options      = {
        key : 'your key', }, //enter key
    shodanClient = new ShodanClient(options),
    searchOptions = {
        query: 'country:RO', //enter country code
        page: process.argv[2],
        minify: true
    };

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'shodan'
});

var host = {
    key : 'your key', //key code
},
hostClient = new ShodanClient(host);

connection.connect();

function doHost(data, i) {
    setTimeout(function() {
        var hostSearch = {
            ip: data['matches'][i]['ip_str']
        };

        //console.log('Parsing: ' + data['matches'][i]['ip_str']);

        hostClient.host(hostSearch, function(errr,response) {
            if(errr) {
                console.log('ERROR: hostClient.search: ' + errr);
            } else {
                connection.query('INSERT INTO `hosts` SET ?', {
                    ip: response.ip_str,
                    asn: response.asn,
                    city: response.city,
                    hostnames: JSON.stringify(response.hostnames),
                    isp: response.isp,
                    vulns: JSON.stringify(response.vulns),
                    lat: response.latitude,
                    long: response.longitude,
                    org: response.org,
                    country: response.country_code,
                    os: response.os,
                    lupdate: response.last_update,
                    ports: JSON.stringify(response.ports)
                }, function( err, result) {
                    if (err) console.log(err);
                   // console.log('Created Result for :' + response.ip_str + ' with ID = ' +  result.insertId);

                    for( var j in response.data) {
                        connection.query('INSERT INTO `banners` SET ?', {
                            ip: result.insertId,
                            product: response.data[j].product,
                            version: response.data[j].version,
                            title: response.data[j].title,
                            port: response.data[j].port,
                            timestamp: response.data[j].timestamp,
                            cpe: JSON.stringify(response.data[j].cpe),
                            data: response.data[j].data,
                            html: response.data[j].html,
                            ssl: JSON.stringify(response.data[j].ssl)
                        }, function(err2, result2) {
                             if (err2) console.log(err2);
                           //  console.log('Port Added to ID ' + result.insertId + ' using ' + result2.insertId + ' handler.');

                             if(i == data.matches.length -1 && j == response.data.length-1) {
                                process.exit(code=0);
                                console.log('--- Done page.');
                            }
                        });
                    }
                });
            }
        });
    }, i*1000);
}

console.log('Parsing page ' + process.argv[2]);

shodanClient.search(searchOptions,  function (err, data) {
   // console.log('\n------------------- search -------------------');
    if (err) {
         console.log('ERROR: shodanClient.search: ' + err);
    } else {
        for(var i in data['matches']) {
            doHost(data, i);            
        }
    }
});
                          
