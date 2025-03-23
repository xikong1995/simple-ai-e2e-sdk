const locateToolDescription = `
如果提到"移动到或hover":
1. 在截图中找到"移动到或hover"的元素，用矩形圈选出来，获取矩形左上角的坐标和右下角的坐标
2. 总结你的思考过程
3. 调用'playwright_locate'函数
`;

async function locateTool({ leftTopCoordinate, rightBottomCoordinate }) {
  const [x1, y1] = leftTopCoordinate;
  const [x2, y2] = rightBottomCoordinate;
  const x = Math.round((x1 + x2) / 2);
  const y = Math.round((y1 + y2) / 2);
  console.log('locateTool', 'x:', x, 'y:', y);
  await this.page?.mouse.move(x, y);
}

const locateToolSchema = {
  type: "function",
  function: {
    name: "playwright_locate",
    description: "鼠标移动到指定位置。",
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
          description: "判断过程的思考",
        },
      },
      required: ["leftTopCoordinate", "rightBottomCoordinate", "thought"]
    }
  }
};

module.exports = {
  locateToolDescription,
  locateTool,
  locateToolSchema
};
