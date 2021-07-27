const fs = require("fs");
var _ = require("underscore");
const request = require("request");
var browserstack = require("browserstack-local");

valid_test_types = ["single", "parallel", "local", "mobile", "fail"];

if (
	(typeof process.env.TEST_TYPE === "undefined" &&
		process.env.TEST_TYPE === "") ||
	!valid_test_types.includes(process.env.TEST_TYPE)
) {
	console.error(
		"Please provide a valid TEST_TYPE when running the test.\nFor e.g. TEST_TYPE=single ./node_modules/.bin/wdio conf/start_tests.conf.js\nList of all valid test types defined in conf/start_tests.conf.js are " +
			valid_test_types
	);
	process.exit(1);
}
const test_type = process.env.TEST_TYPE;
let raw_caps_data = fs.readFileSync("conf/caps.json");
let caps_object = JSON.parse(raw_caps_data);
var test_list = caps_object["tests"];
filtered_test_type = _.where(test_list, { test_type: test_type });

var capabilities = [];

for (let obj_arr of Object.entries(filtered_test_type[0]["session_caps"])) {
	var caps_hash = {};
	for (let [key, value] of Object.entries(obj_arr[1])) {
		caps_hash[key] = value;
	}
	for (let [key, value] of Object.entries(
		filtered_test_type[0]["common_caps"]
	)) {
		if (key == "name" && typeof caps_hash["browser"] != "undefined") {
			caps_hash[key] = value + caps_hash["browser"];
		} else if (key == "name" && typeof caps_hash["device"] != "undefined") {
			caps_hash[key] = value + caps_hash["device"];
		} else {
			caps_hash[key] = value;
		}
	}
	capabilities.push(caps_hash);
}

specs = filtered_test_type[0]["specs"];

exports.config = {
	user: process.env.BROWSERSTACK_USERNAME || "BROWSERSTACK_USERNAME",
	key: process.env.BROWSERSTACK_ACCESS_KEY || "BROWSERSTACK_ACC_KEY",

	updateJob: false,
	specs: specs,
	exclude: [],
	maxInstances: 5,

	capabilities: capabilities,

	logLevel: "error",
	coloredLogs: true,
	screenshotPath: "./errorShots/",
	baseUrl: "",
	waitforTimeout: 10000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,
	host: "hub-usw.browserstack.com",
	hostname: "hub-usw.browserstack.com",

	before: function () {
		var chai = require("chai");
		global.expect = chai.expect;
		chai.Should();
	},
	framework: "mocha",
	mochaOpts: {
		ui: "bdd",
		timeout: 60000,
	},
	// Code to start browserstack local before start of test
	onPrepare: function (config, capabilities) {
		if (test_type === "local") {
			console.log("Connecting local");
			return new Promise(function (resolve, reject) {
				var local_caps_hash = {};
				local_caps_hash["key"] = exports.config.key;
				for (let [key, value] of Object.entries(
					filtered_test_type[0]["local_binding_caps"]
				)) {
					local_caps_hash[key] = value;
				}
				exports.bs_local = new browserstack.Local();
				exports.bs_local.start(local_caps_hash, function (error) {
					if (error) return reject(error);
					console.log("Connected. Now testing...");
					resolve();
				});
			});
		}
	},

	// Code to stop browserstack local after end of test
	onComplete: function (exitCode, config, capabilities, results) {
		if (test_type === "local") {
			return new Promise(function (resolve, reject) {
				exports.bs_local.stop(function (error) {
					if (error) return reject(error);
					resolve();
				});
			});
		}
	},
};
