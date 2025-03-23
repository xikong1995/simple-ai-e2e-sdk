const dayjs = require("dayjs");
const path = require("path");
const { chromium } = require("playwright");
const { Jimp } = require("jimp");
const { cssColorToHex} = require("@jimp/utils")
const QwenModel = require("./model");
const { judgeTool, locateTool, clickTool, inputTool } = require("./tools");

class AIE2ETest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.qwenModel = new QwenModel();
  }

  async init() {
    this.browser = await chromium.launch({
      headless: false,
    });
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async goto(url) {
    if (!this.page) {
      throw new Error("Page is not initialized");
    }
    await this.page.goto(url);
  }

  async saveImg() {
    if (!this.page) {
      throw new Error("Page is not initialized");
    }
    await this.page.waitForLoadState("networkidle");
    const timestamp = dayjs().format("YYYY-MM-DD_HHmmss") + "_" + Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const screenshotPath = path.join(__dirname, `../.tmp/img/${timestamp}.png`);
    return await this.page.screenshot({ path: screenshotPath });
  }

  /**
   * 绘制矩形框
   *
   */
  async drawRect({ buffer, leftTopCoordinate, rightBottomCoordinate }) {
    const [rectX, rectY] = leftTopCoordinate;
    const [rectX2, rectY2] = rightBottomCoordinate;
    const rectWidth = rectX2 - rectX; // 矩形框的宽度
    const rectHeight = rectY2 - rectY; // 矩形框的高度
    // 矩形框的颜色，这里使用十六进制颜色码
    const rectColor = cssColorToHex("#eb8850");

    const image = await Jimp.read(buffer);

    image.composite(
      new Jimp({ width: rectWidth, height: 2, color: rectColor }),
      rectX,
      rectY
    );

    image.composite(
      new Jimp({ width: 2, height: rectHeight, color: rectColor }),
      rectX + rectWidth - 2,
      rectY
    );

    image.composite(
      new Jimp({ width: rectWidth, height: 2, color: rectColor }),
      rectX,
      rectY + rectHeight - 2
    );

    image.composite(
      new Jimp({ width: 2, height: rectHeight, color: rectColor }),
      rectX,
      rectY
    );

    const timestamp = dayjs().format("YYYY-MM-DD_HHmmss") + "_" + Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const screenshotPath = path.join(__dirname, `../.tmp/img/${timestamp}.png`);

    await image.write(screenshotPath);
  }

  async aiAssert(userInput) {
    if (!this.page) {
      throw new Error("Page is not initialized");
    }

    await this.page.waitForTimeout(1500);

    const screenshot = await this.saveImg();

    // 获取大模型返回结果
    const completion = await this.qwenModel.call({
      image: screenshot.toString("base64"),
      prompt: userInput,
    });

    console.log(
      "aiAssert response:",
      JSON.stringify(completion.choices[0].message)
    );

    const toolCalls = completion.choices[0].message.tool_calls || [];

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArguments = JSON.parse(toolCall.function.arguments);

      if (functionName === "playwright_judge") {
        await judgeTool.bind(this)(functionArguments);
      }
    }
  }

  async aiAction(userInput) {
    if (!this.page) {
      throw new Error("Page is not initialized");
    }

    const screenshot = await this.saveImg();

    // 获取大模型返回结果
    const completion = await this.qwenModel.call({
      image: screenshot.toString("base64"),
      prompt: userInput,
    });

    console.log(
      "aiAction response:",
      JSON.stringify(completion.choices[0].message)
    );

    const toolCalls = completion.choices[0].message.tool_calls || [];

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArguments = JSON.parse(toolCall.function.arguments);
      switch (functionName) {
        case "playwright_locate":
          await locateTool.bind(this)(functionArguments);
          break;
        case "playwright_click":
          await clickTool.bind(this)(functionArguments);
          break;
        case "playwright_input":
          await inputTool.bind(this)(functionArguments);
          break;
        default:
          console.log("Unknown tool call:", functionName);
      }

      // 如果是playwright_locate，playwright_click事件，则根据返回的坐标点进行矩形框的绘制
      if (
        functionName === "playwright_locate" ||
        functionName === "playwright_click"
      ) {
        const { leftTopCoordinate, rightBottomCoordinate } = functionArguments;
        await this.drawRect({
          buffer: screenshot,
          leftTopCoordinate,
          rightBottomCoordinate,
        });
      }
    }
  }
}

module.exports = AIE2ETest;
