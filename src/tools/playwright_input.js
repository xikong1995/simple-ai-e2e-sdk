const inputToolDescription = `
如果提到"输入":
1. 在截图中找到"输入框"，用矩形圈选出来，获取矩形左上角的坐标和右下角的坐标，调用'playwright_click'函数
2. 获取用户提到的输入内容
3. 总结你的思考过程
4. 调用'playwright_input'函数
`;

async function inputTool({ text }) {
  console.log('inputTool', 'text:', text);
  await this.page?.keyboard.type(text);
}

const inputToolSchema = {
  type: "function",
  function: {
    name: "playwright_input",
    description: "输入文本。",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "要输入的文本",
        },
        thought: {
          type: "string",
          description: "思考过程",
        }
      },
      required: ["text", "thought"]
    }
  }
};

module.exports = {
  inputToolDescription,
  inputTool,
  inputToolSchema
};
