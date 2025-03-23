const {
  clickToolDescription,
  inputToolDescription,
  judgeToolDescription,
  locateToolDescription
} = require("../tools/index.js");

const system_prompt = `
你是一个网页UI助手。

${locateToolDescription}

${clickToolDescription}

${inputToolDescription}

${judgeToolDescription}
`;

function getMessages({
  image,
  prompt
}) {
  return [
    { role: 'system', content: system_prompt },
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${image}`
          },
        }
      ]
    }
  ];
}

module.exports = {
  getMessages
};
