const clickToolDescription = `
如果提到"点击或click":
1. 在截图中找到"点击或click"的元素，用矩形圈选出来，获取矩形左上角的坐标和右下角的坐标
2. 总结你的思考过程
3. 调用'playwright_click'函数
`;

async function clickTool({ leftTopCoordinate, rightBottomCoordinate }) {
  const [x1, y1] = leftTopCoordinate;
  const [x2, y2] = rightBottomCoordinate;
  const x = Math.round((x1 + x2) / 2);
  const y = Math.round((y1 + y2) / 2);
  console.log('clickTool', 'x:', x, 'y:', y);
  await this.page?.mouse.click(x, y);
}

const clickToolSchema = {
  type: "function",
  function: {
    name: "playwright_click",
    description: "鼠标点击指定位置。",
    parameters: {
      type: "object",
      properties: {
        leftTopCoordinate: {
          type: "array",
          items: {
            type: "integer",
            description: "数组中第一个元素是左上角x坐标，第二个元素是左上角y坐标",
          }
        },
        rightBottomCoordinate: {
          type: "array",
          items: {
            type: "integer",
            description: "数组中第一个元素是左上角x坐标，第二个元素是左上角y坐标",
          }
        },
        thought: {
          type: "string",
          description: "思考过程",
        }
      },
      required: ["leftTopCoordinate", "rightBottomCoordinate", "thought"]
    }
  },
};

module.exports = {
  clickToolDescription,
  clickTool,
  clickToolSchema
};
