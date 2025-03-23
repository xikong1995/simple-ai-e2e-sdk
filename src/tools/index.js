const click = require('./playwright_click');
const input = require('./playwright_input');
const locate = require('./playwright_locate');
const judge = require('./playwright_judge');

module.exports = {
  ...click,
  ...input,
  ...locate,
  ...judge
};
