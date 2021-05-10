import { CronStrPipe } from './cron-str.pipe';

describe('CronStrPipe', () => {
  it('create an instance', () => {
    const pipe = new CronStrPipe();
    expect(pipe).toBeTruthy();
  });
});
