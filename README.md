# babel-plugin-collect-jsx-attribute
babel-plugin, collect jsx attribute


# usage
```js
yarn add babel-plugin-collect-jsx-attribute
```
then, in babel configuration file
```js
    plugins: [
      [
        "collect-jsx-attribute",
        {
          attributes: ["xxxx"], // JSX properties to collect
          filename: "xxx.json" // Generated filename
        }
      ]
    ]
```
