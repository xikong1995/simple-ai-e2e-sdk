require('dotenv/config');
const AIE2ETest = require('../src/index.js');

// 创建测试实例
const test = new AIE2ETest();

// 运行测试
async function runTest() {
  try {
    // 初始化浏览器
    await test.init();

    await test.goto('https://so.douyin.com/');

    // 执行AI驱动的E2E测试
    await test.aiAction('点击输入框，输入"天气"');

    await test.aiAction('点击搜索');

    await test.aiAssert('判断页面出现"天气"相关结果');

    // 等待3秒查看结果
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('测试执行失败:', error);
  } finally {
    // 关闭浏览器
    await test.close();
  }
}

runTest();
