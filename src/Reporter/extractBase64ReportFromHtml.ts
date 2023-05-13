export function extractBase64ReportFromHtml(code: string) {
  const startMarker = 'window.playwrightReportBase64 = "';

  const startIndex = code.indexOf(startMarker);
  const startCode = code.substring(startIndex + startMarker.length);

  const endIndex = startCode.indexOf('"');
  const result = startCode.substring(0, endIndex);

  return result.trim();
}
