import { describe, it } from '@jest/globals';
import { extractBase64ReportFromHtml } from './extractBase64ReportFromHtml';
import { expect } from '@playwright/test';

describe('extractBase64ReportFromHtml', () => {
  it('extracts report summary from html correctly', () => {
    const encodedString = 'This is correct base64 extraction!';

    const result = extractBase64ReportFromHtml(`
Hello, world!
<script>
    window.playwrightReportBase64 = "${encodedString}"
</script>
Should work quite well
`);

    expect(result).toEqual(encodedString);
  });
});
