'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://products.z-wavealliance.org/products/1615

module.exports = new ZwaveDriver(path.basename(__dirname), {
	//debug: true,
	capabilities: {
		alarm_contact: {
			command_class: 'COMMAND_CLASS_SENSOR_BINARY',
			command_get: 'SENSOR_BINARY_GET',
			command_report: 'SENSOR_BINARY_REPORT',
			command_report_parser: report => report['Sensor Value'] === 'detected an event'
		},
		measure_battery: {
			command_class: 'COMMAND_CLASS_BATTERY',
			command_get: 'BATTERY_GET',
			command_report: 'BATTERY_REPORT',
			command_report_parser: report => {
				if (report['Battery Level'] === 'battery low warning') return 1;
				if (report.hasOwnProperty('Battery Level (Raw)')) return report['Battery Level (Raw)'][0];
				return null;
			},
		},
	},
	settings: {
		1: {
			index: 1,
			size: 1,
		},
		101: {
			index: 101,
			size: 1,
		},
	},
});
