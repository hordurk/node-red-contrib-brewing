module.exports = function(RED) {
	function NobleConnectionNode(n) {
		RED.nodes.createNode(this, n);
		var noble = require('noble');
		this.noble = noble;
		var node = this;

	        var serviceUUIDs = [
                            "a495bb10c5b14b44b5121370f02d74de",
                            "a495bb20c5b14b44b5121370f02d74de",
                            "a495bb30c5b14b44b5121370f02d74de",
                            "a495bb40c5b14b44b5121370f02d74de",
                            "a495bb50c5b14b44b5121370f02d74de",
                            "a495bb60c5b14b44b5121370f02d74de",
                            "a495bb70c5b14b44b5121370f02d74de",
                            "a495bb80c5b14b44b5121370f02d74de",
                            "a495ff10c5b14b44b5121370f02d74de"
                          ];

		function startScan() {
			node.log("Noble start scanning");
			noble.startScanning(serviceUUIDs, true);
		}

		noble.on('stateChange', function(state) {
			node.log("Noble state change: "+state);
			if (state === 'poweredOn') {
				startScan();
			} else {
				noble.stopScanning();
			}
		});

		this.on('close', function() {
			node.log("Closing Noble");
			noble.stopScanning();
			noble.removeAllListeners();
		});

		if(noble.state === "poweredOn") {
			startScan();
		}
	}
	RED.nodes.registerType("noble-connection", NobleConnectionNode);
}
