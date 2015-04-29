# Shodan-Country-Crawler-
Crawl country details (including all banners) based on SHODAN NodeJS API

# Requirements
- NodeJS
- NodeJS Shodan API
- Shodan API Code
- Country Code, example: Romania's country code is (RO)
- NodeJS mysql

# Install

1. Create a mysql database called shodan.
2. Add the following tables.
```mysql
CREATE TABLE IF NOT EXISTS `hosts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` char(100) NOT NULL,
  `asn` char(100) DEFAULT NULL,
  `city` char(100) DEFAULT NULL,
  `hostnames` char(255) DEFAULT NULL,
  `isp` char(100) DEFAULT NULL,
  `vulns` text,
  `lat` float DEFAULT NULL,
  `long` float DEFAULT NULL,
  `org` char(255) DEFAULT NULL,
  `country` char(5) DEFAULT NULL,
  `os` char(100) DEFAULT NULL,
  `lupdate` char(100) DEFAULT NULL,
  `ports` text,
  PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` int(11) NOT NULL,
  `product` mediumtext,
  `version` mediumtext,
  `port` int(11) DEFAULT NULL,
  `title` mediumtext,
  `timestamp` char(255) DEFAULT NULL,
  `cpe` mediumtext,
  `data` blob,
  `html` blob,
  `ssl` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
```
3. Run the following command.
```bash
for i in {1..1000}; do; nodejs shodan.js $i >> shodanlogs; sleep 5s; done &
```

# Limitations (for developers)
It seems that Shodan API has some restrictions against the number of queries/s, the error you will get is the following. I partialy solved using the timeout found at line 27:

```ERROR: hostClient.search: request.get: null (code: 503)```
