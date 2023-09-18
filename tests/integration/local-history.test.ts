import path from 'path';
import fs from 'fs';
import { executeStryker } from './utils';

const historyDir = path.resolve(__dirname, 'local-history', '.history');
const disabledHistoryDir = path.resolve(__dirname, 'local-history-disabled', '.history');

describe('local history', () => {
  beforeEach(() => {
    if (fs.existsSync(historyDir)) {
      fs.rmSync(historyDir, { recursive: true });
    }
  });

  it('stores a history file for a test run', async () => {
    expect(fs.existsSync(historyDir)).toEqual(false);

    // execute newman in the subdirectory
    await executeStryker('local-history', 'run');

    expect(fs.existsSync(historyDir)).toEqual(true);

    const historyFiles = fs.readdirSync(historyDir);

    expect(historyFiles).toHaveLength(1);

    historyFiles.forEach((file) => {
      const history = JSON.parse(fs.readFileSync(path.resolve(historyDir, file)).toString());

      expect(typeof history.time).toEqual('number');
      expect(history.testResults).toStrictEqual([
        {
          group: history.testResults[0].group,
          points: 2,
          maxPoints: 2,
          strategy: 'add',
          manualCheck: false,
          tests: [
            {
              name: 'example-ArithmeticOperator',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
            {
              name: 'example-BlockStatement',
              points: 1,
              maxPoints: 1,
              successful: true,
              required: false,
              manualCheck: false,
            },
          ],
        },
      ]);
    });
  }, 60000);

  it('is disabled by default', async () => {
    expect(fs.existsSync(disabledHistoryDir)).toEqual(false);

    // execute newman in the subdirectory
    await executeStryker('local-history-disabled', 'run');

    expect(fs.existsSync(disabledHistoryDir)).toEqual(false);
  }, 60000);
});
