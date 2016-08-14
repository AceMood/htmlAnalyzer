# htmlAnalyzer

## Purpose

We must do some optimizations on mobile web page first load. We also put all static resources
inline on the html document. I write the html analyzer to analyze any web page inlined resource size
on Internet and give the final result. External resources are skipped. For example:

``` html
<link type="text/css" rel="stylesheet" href="a.css" />
<script src="a.js"></script>
```

Will not be caught to do any analyse because they are externally referred.

``` html
<script src="a.js"></script>
```

## Installation

Make sure you have [phantomjs](http://phantomjs.org/download.html) installed.
htmlAnalyzer depend on it to fetch url web page content then report the result.
You may encounter the problem describe [here](https://github.com/ariya/phantomjs/issues/12900)
if you run the program on MAC OS Yoesmite.

Then you install htmlAnalyzer through npm:

```
npm install htmlAnalyzer -g
```

## Usage



## Tips