const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    await page.goto('file://e:/Z-Work/Saikat/Test/S.S.Portfolio/index.html', { waitUntil: 'networkidle0' });
    
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('ssr_portfolio_data');
    });
    
    console.log('LOCALSTORAGE:', localStorageData);
    
    await browser.close();
  } catch (err) {
    console.error('SCRIPT ERROR:', err);
  }
})();
