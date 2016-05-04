var fs = require('fs');
var path = require('path');
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var nodePersist = require('../node-persist.js');
var persistDataDir = 'persist'
var testDataDir = 'test-data'

describe('Unit Testing nodePersist', function() {
	// Common object utilised for testing
	var commonTestObject = {
		1: 1,
		2: 'two',
		'three': {1: 1}
	}
	beforeEach(function(){
		// Initialise nodePersist with defaults
		var defaults = {
    		dir: testDataDir,
    		stringify: JSON.stringify,
    		parse: JSON.parse,
    		encoding: 'utf8',
    		logging: false,
    		continuous: true,
    		interval: false
		};
		nodePersist.initSync(defaults);
	});
	after(function(){
		// Remove test-data directory
		fs.rmdir(path.join(persistDataDir, testDataDir));
	})
	describe('Testing independent getter functions', function(){
		beforeEach(function(){
			// Set keys to test getter functionality.
			nodePersist.clear();
			nodePersist.setItem('test-get-key-int', 42);
			nodePersist.setItem('test-get-key-obj', commonTestObject);
		});
		after(function(){
			// Reset all changes to nodePersist after testing getter functionality.
			nodePersist.clear();
		})
		it('getItem() should return undefined if new key is passed', function() {
			// Handle non existant key case for getItem() 
			expect(nodePersist.getItem('no-such-key')).to.be.undefined;
		});
		it('getItem() should return value when existant', function(){
			// Handle existant key case for getItem()
			expect(nodePersist.getItem('test-get-key-obj')).to.be.eql(commonTestObject);
			expect(nodePersist.getItem('test-get-key-int')).to.be.equal(42);
		});
		it('length() should return number of keys', function() {
			// Ensure length functionality returns correct number of keys in persistence.
			expect(nodePersist.length()).to.be.equal(2);
		});
		it('values() should return values of all keys', function() {
			// Ensure length functionality returns correct number of keys in persistence.
			nodePersist.values(function(expectedValue){
				expect(expectedValue).to.include(42);
				expect(expectedValue).to.include(commonTestObject);
			});
		});
	});
	describe('Testing independent delete functions', function(){
		beforeEach(function(){
			// Set keys to test delete functionality.
			nodePersist.clear();
			nodePersist.setItem('test-remove-key', 42);
			nodePersist.setItem('test-clear-key-int', 42);
			nodePersist.setItem('test-clear-key-obj', commonTestObject);
		});
		after(function(){
			// Reset all changes to nodePersist after testing delete functionality.
			nodePersist.clear();
		})
		it('removeItem() should remove existing key from persistence', function() {
			// Test removal of specific key from persistence.
			expect(nodePersist.getItem('test-remove-key')).to.not.be.undefined;
			nodePersist.removeItem('test-remove-key');
			expect(nodePersist.getItem('test-remove-key')).to.be.undefined
		});

		it('clear() should remove all keys from persistence', function() {
			// Test removal of all keys from persistence.
			expect(nodePersist.getItem('test-clear-key-obj')).to.not.be.undefined;
			expect(nodePersist.getItem('test-clear-key-int')).to.not.be.undefined;
			nodePersist.clear()
			expect(nodePersist.getItem('test-clear-key-obj')).to.be.undefined;
			expect(nodePersist.getItem('test-clear-key-int')).to.be.undefined;
		});
	})
	it('Catch exceptions from setItem() ', function() {
		// Catch any expections from setitem, as other functions dependent on it
		expect(function(){
			nodePersist.setItem('test-set-int', 42)
		}).to.not.throw(Error);
		expect(function(){
			nodePersist.setItem('test-set-obj', commonTestObject)
		}).to.not.throw(Error);
		nodePersist.clear();
	});
});