module.exports = function(RED) {
    function TiltHydrometerNode(config) {

	var tiltColors = {
                            "a495bb10c5b14b44b5121370f02d74de": "red",
                            "a495bb20c5b14b44b5121370f02d74de": "green",
                            "a495bb30c5b14b44b5121370f02d74de": "black",
                            "a495bb40c5b14b44b5121370f02d74de": "purple",
                            "a495bb50c5b14b44b5121370f02d74de": "orange",
                            "a495bb60c5b14b44b5121370f02d74de": "blue",
                            "a495bb70c5b14b44b5121370f02d74de": "yellow",
                            "a495bb80c5b14b44b5121370f02d74de": "pink",
                            "a495ff10c5b14b44b5121370f02d74de": "blue"
	};

        RED.nodes.createNode(this,config);
        var node = this;
        this.color = config.color;
	this.connection = RED.nodes.getNode(config.connection);

        node.status({text: 'Offline', fill: 'red', shape: 'dot'});

        var noble = this.connection.noble;

	var onStateChange = function(state) {
		if(state === "poweredOn") {
			node.status({text: 'Scanning', fill: 'green', shape: 'dot'});
		} else {
			node.status({text: 'Offline', fill: 'red', shape: 'dot'});
		}
	};

	var onDiscover = function(peripheral) {
            if (peripheral.advertisement.manufacturerData) {
                var color = tiltColors[peripheral.advertisement.serviceUuids[0]];
                var temp = (peripheral.advertisement.manufacturerData[20]*256+peripheral.advertisement.manufacturerData[21] - 32)/1.8;
                var sg = (peripheral.advertisement.manufacturerData[22]*256+peripheral.advertisement.manufacturerData[23])/1000.0;
                if (!node.color || (node.color != "" && node.color === color)) {
                        node.send([{payload: temp, color: color}, {payload: sg, color: color}]);
                } else {
			node.log("Not sending data. Configured color: "+node.color+". Received color: "+color);
		}
            }
	};

        this.on('close', function(){
		noble.removeListener('stateChange', onStateChange);
		noble.removeListener('discover', onDiscover);
        });

        if(noble) {
		noble.on('stateChange', onStateChange);
		noble.on('discover', onDiscover);
		if(noble.state === "poweredOn") {
			onStateChange("poweredOn");
		}
	}

    }
    RED.nodes.registerType("tilt-hydrometer",TiltHydrometerNode);
}
