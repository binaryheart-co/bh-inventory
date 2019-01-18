const { BloomFilter } = require('bloomfilter');
const bloomdata = require('./secList_1M.json');

const passwordSet = new BloomFilter(bloomdata.bloomFilterData, bloomdata.numberOfHashes);

module.exports = {
  test: (password = '') => passwordSet.test(password.toLowerCase())
};