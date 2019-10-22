const babel = require("@babel/core");
const plugin = require("../src/index");

var example = `
  <>
    <div data-authority={2} data-test={6} style={{margin: 10, paddig: 10}} hide>test</div>
    <button data-authority={2}>test</button>
  </>
`;

it("works", () => {
  const { code } = babel.transform(example, {
    presets: ["@babel/preset-react"],
    plugins: [
      [
        plugin,
        {
          attributes: ["data-authority", "data-test"],
          filename: "collect-jsx-attribute.json"
        }
      ]
    ]
  });
  expect(code).toMatchSnapshot();
});
