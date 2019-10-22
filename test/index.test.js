const babel = require("@babel/core");
const plugin = require("../src/index");

var example = `
  <>
    <b data-authority={[2,3]}>sada</b>
    <div data-authority={2} data-test={6} style={{margin: 10}} hide>test</div>
    <button data-authority={2} className="testClass">test</button>
    <a href="http://wwwww.asfafafaf,affa/.com">连接</a>
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
