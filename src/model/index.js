const OpenAI = require("openai");
const {
  locateToolSchema,
  clickToolSchema,
  inputToolSchema,
  judgeToolSchema,
} = require("../tools");
const { getMessages } = require("../message");

class QwenModel {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
  }

  async call(options) {
    const messages = getMessages(options);
    return this.openai.chat.completions.create({
      model: process.env.MIDSCENE_MODEL_NAME,
      messages: messages,
      tools: [
        locateToolSchema,
        clickToolSchema,
        inputToolSchema,
        judgeToolSchema,
      ],
    });
  }
}

module.exports = QwenModel;
