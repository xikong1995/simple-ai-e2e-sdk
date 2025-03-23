const { expect } = require('@playwright/test');

const judgeToolDescription = `
如果提到"判断":
1. 在截图中找到"判断"的元素，用矩形圈选出来，获取矩形左上角的坐标和右下角的坐标
2. 对比截图中"判断"元素特征和用户提到的内容是否一致
3. 如果一致，返回true，否则返回false
4. 总结你的思考过程
5. 调用'playwright_judge'函数
`;

async function judgeTool({ pass }) {
  console.log('judgeTool', 'pass:', pass);
  await expect(pass).toBe(true);
}

const judgeToolSchema = {
  type: "function",
  function: {
    name: "playwright_judge",
    description: "判断截图中的元素特征是否与用户描述一致。",
    parameters: {
      type: "object",
      properties: {
        pass: {
          type: "boolean",
          description: "判断结果，true表示一致，false表示不一致",
        },
        thought: {
          type: "string",
          description: "判断过程的思考",
        },
      },
      required: ["pass", "thought"]
    }
  }
};

module.exports = {
  judgeToolDescription,
  judgeTool,
  judgeToolSchema
};
