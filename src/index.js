const fs = require("fs");

module.exports = function() {
  return {
    name: "babel-plugin-collect-jsx-attribute",
    pre() {
      this.cache = {};
    },
    visitor: {
      JSXAttribute(path, state) {
        if (!state.opts) {
          throw path.buildCodeFrameError(
            "It seems that you have not set the configuration of babel-plugin-collect-jsx-attribute."
          );
        }
        if (!state.opts.attributes) {
          throw path.buildCodeFrameError(
            "You don't seem to have set the jsx-attribute configuration item of babel-plugin-collect-jsx-attribute."
          );
        }
        if (!state.opts.filename) {
          throw path.buildCodeFrameError(
            "You don't seem to have set a filename of babel-plugin-collect-jsx-attribute."
          );
        }
        const { opts } = state;
        const nameObj = path.node.name;
        const valueObj = path.node.value;
        const key = nameObj.name;
        // 没有值的不收集
        if (!valueObj) return;
        const value = valueObj.expression.value;

        if (opts.attributes.findIndex(item => item === key) !== -1) {
          if (this.cache[key]) {
            if (this.cache[key].findIndex(item => item === value) === -1) {
              this.cache[key].push(value);
            }
          } else {
            this.cache[key] = [value];
          }
        }
      }
    },
    post(state) {
      const plugin = state.opts.plugins.find(
        item => item.key === "babel-plugin-collect-jsx-attribute"
      );
      const { filename } = plugin.options;
      fs.writeFileSync(filename, JSON.stringify(this.cache));
    }
  };
};
