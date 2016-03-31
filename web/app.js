var map = L.map('map').setView([40.756, -73.991], 13);

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(map);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19,
}).addTo(map);;

var marker = null;
var blocks = [];
var xhr = null;

function addBlock(lat, lng, alpha) {
    var s = 0.001 / 2;
    var bounds = [[lat - s, lng - s], [lat + s, lng + s]];
    var options = {
        fillColor: "#ff0000",
        weight: 0,
        fillOpacity: alpha,
        clickable: false,
    };
    var block = L.rectangle(bounds, options).addTo(map);
    blocks.push(block);
}

function createMarker(lat, lng) {
    marker = L.marker([lat, lng]).addTo(map);
}

function removeBlocks() {
    if (marker) {
        map.removeLayer(marker);
    }
    marker = null;
    blocks.forEach(function(block) {
        map.removeLayer(block);
    });
    blocks = [];
}

function parseBlocks(data) {
    var lines = data.split("\n");
    var lo = 3;
    var hi = 300;
    lines.forEach(function(line) {
        var row = line.split(",");
        var lat = parseFloat(row[0]);
        var lng = parseFloat(row[1]);
        var count = parseInt(row[2]);
        if (count < lo) {
            return;
        }
        var p = (count - lo) / (hi - lo);
        p = Math.min(p, 1);
        p = Math.max(p, 0);
        p = Math.pow(p, 0.75);
        var alpha = 0.05 + p * 0.75;
        addBlock(lat, lng, alpha);
    });
}

function parseHours(data) {
    var hours = data.split(",");
    for (var i = 0; i < hours.length; i++) {
        hours[i] = parseInt(hours[i]);
    }
    var hi = Math.max.apply(null, hours);
    var bars = d3.select("#hours").selectAll("div").data(hours);
    bars.enter()
        .append("div")
        .attr("class", "bar")
        .attr("data-toggle", "tooltip")
        .attr("data-placement", "right")
        ;
    bars
        .attr("title", function(d, i) {
            var h = i % 12;
            if (h === 0) h = 12;
            var hs;
            if (i < 12) {
                hs = h + "am";
            } else {
                hs = h + "pm";
            }
            return hs + " - " + d + " rides";
        })
        .transition()
        .style("width", function(d) {
            if (hi === 0) {
                return "0";
            }
            var h = (d / hi) * 230;
            return h + "px";
        })
        ;
    $('[data-toggle="tooltip"]').tooltip('fixTitle');
}

function loadBlocks(lat, lng) {
    var a = Math.round(lat * 1000);
    var b = Math.round(-lng * 1000);
    var url = "blocks1/" + a + "." + b + ".txt";
    if (xhr) {
        xhr.abort();
    }
    xhr = $.ajax({
        url: url,
        success: function(result) {
            parseBlocks(result);
        },
        error: function() {
        }
    });
}

function loadHours(lat, lng) {
    var a = Math.round(lat * 1000);
    var b = Math.round(-lng * 1000);
    var url = "hours1/" + a + "." + b + ".txt";
    $.ajax({
        url: url,
        success: function(result) {
            parseHours(result);
        }
    });
}

function select(lat, lng) {
    var lat = Math.round(lat * 1000) / 1000;
    var lng = Math.round(lng * 1000) / 1000;
    removeBlocks();
    createMarker(lat, lng);
    loadHours(lat, lng);
    loadBlocks(lat, lng);
}

map.on('click', function(e) {
    select(e.latlng.lat, e.latlng.lng);
});

parseHours("0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0");
select(40.756, -73.991);
