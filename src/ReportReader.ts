import TaskConfig from '@skills17/task-config';
import { TestRun } from '@skills17/test-result';
import { MutationTestResult } from 'mutation-testing-report-schema';
import path from 'path';
import fs from 'fs';

export default class ReportReader {
  public readonly testRun: TestRun;

  private readonly consumedReports: string[] = [];

  constructor(private config: TaskConfig) {
    this.testRun = this.config.createTestRun();
  }

  readTestReport() {
    const files = this.orderRecentFiles();
    if (!files.length) {
      throw new Error('Could not find recent stryker json report.');
    }
    const recentReport = path.resolve(
      this.config.getProjectRoot(),
      'reports',
      'mutation',
      files[0].file,
    );

    if (this.consumedReports.includes(recentReport)) {
      throw new Error(
        'Most recent report has already been consumed. There should have be a more recent one.',
      );
    }

    this.consumedReports.push(recentReport);
    const mutationReport = JSON.parse(String(fs.readFileSync(recentReport)));
    this.record(mutationReport);
  }

  private orderRecentFiles() {
    const dir = path.resolve(this.config.getProjectRoot(), 'reports', 'mutation');
    if (!fs.existsSync(dir)) {
      return [];
    }
    return fs
      .readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .filter((file) => file.endsWith('.json'))
      .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  }

  private record(mutationReport: MutationTestResult) {
    // extract tests
    const tests: {
      [id: string]: { fullName: string; testName: string; extra: boolean; successful: boolean };
    } = {};

    Object.keys(mutationReport?.files || {}).forEach((file) => {
      mutationReport?.files?.[file]?.mutants?.forEach((mutant) => {
        const fileKey = file.replace('src/', '').replace('.js', '').replace(/\//g, '.');
        const testIdentifier = `${fileKey}-${mutant.mutatorName}`;
        if (tests[testIdentifier] && tests[testIdentifier].successful) {
          tests[testIdentifier].successful = mutant.status === 'Killed';
        } else {
          tests[testIdentifier] = {
            fullName: `${fileKey} > ${mutant.mutatorName}`,
            testName: testIdentifier,
            extra: false,
            successful: mutant.status === 'Killed',
          };
        }
      });
    });

    // record test results
    Object.values(tests)
      .sort((a, b) => a.testName.localeCompare(b.testName))
      .forEach((test) => {
        this.testRun.recordTest(test.fullName, test.testName, test.extra, test.successful);
      });
  }
}
