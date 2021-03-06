'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.cd-jackson.com/index.php/zwave/zwave-device-database/zwave-device-list/devicesummary/83

module.exports = new ZwaveDriver(path.basename(__dirname), {
	capabilities: {
		onoff: [
			{
				command_class: 'COMMAND_CLASS_SWITCH_BINARY',
				command_set: 'SWITCH_BINARY_SET',
				command_set_parser: value => ({
					'Switch Value': value,
				}),
			},
			{
				command_class: 'COMMAND_CLASS_BASIC',
				command_report: 'BASIC_REPORT',
				command_report_parser: report => {
					if (report.hasOwnProperty('Current Value')) return report['Current Value'] !== 0;
					if (report.hasOwnProperty('Value')) return report['Value'] !== 0;
					return null;
				},
			},
		],
		measure_power: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				'Sensor Type': 'Electric meter',
				'Properties1': {
					'Scale': 0,
				},
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties1') &&
					report.Properties1.hasOwnProperty('Scale') &&
					report.Properties1['Scale'] === 0) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
		},
		meter_power: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				'Sensor Type': 'Electric meter',
				'Properties1': {
					'Scale': 2,
				},
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties1') &&
					report.Properties1.hasOwnProperty('Scale') &&
					report.Properties1['Scale'] === 2) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
		},
	},
	settings: {
		3: {
			index: 3,
			size: 1,
		},
		20: {
			index: 20,
			size: 1,
		},
		80: {
			index: 80,
			size: 1,
			parser: input => new Buffer([(input) ? 2 : 0]),
		},
		81: {
			index: 81,
			size: 1,
		},
		91: {
			index: 91,
			size: 2,
		},
		102: {
			index: 102,
			size: 4,
		},
		103: {
			index: 103,
			size: 4,
		},
		111: {
			index: 111,
			size: 4,
		},
		112: {
			index: 112,
			size: 4,
		},
		113: {
			index: 113,
			size: 4,
		},
	},
});
