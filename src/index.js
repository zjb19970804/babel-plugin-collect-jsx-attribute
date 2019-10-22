const fs = require("fs");

module.exports = function({ types: t }) {
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
        let value;
        // 字符串
        if (t.isStringLiteral(valueObj)) {
          value = valueObj.value;
        } else if (
          // 数字
          t.isJSXExpressionContainer(valueObj) &&
          t.isNumericLiteral(valueObj.expression)
        ) {
          value = valueObj.expression.value;
        } else if (
          // 对象
          t.isJSXExpressionContainer(valueObj) &&
          t.isObjectExpression(valueObj.expression)
        ) {
          // 对象属性
          const properties = valueObj.expression.properties;
          value = {};
          properties.forEach(item => {
            value[item.key.name] = item.value.value;
          });
        } else if (
          t.isJSXExpressionContainer(valueObj) &&
          t.isArrayExpression(valueObj.expression)
        ) {
          const elements = valueObj.expression.elements;
          value = elements.map(item => item.value);
        }

        // 插入收集的集合
        if (opts.attributes.findIndex(item => item === key) !== -1) {
          if (this.cache[key]) {
            if (Array.isArray(value)) {
              value.forEach(v => {
                if (this.cache[key].findIndex(k => k === v) === -1) {
                  this.cache[key].push(v);
                }
              });
            } else {
              if (this.cache[key].findIndex(item => item === value) === -1) {
                this.cache[key].push(value);
              }
            }
          } else {
            this.cache[key] = Array.isArray(value) ? value : [value];
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
