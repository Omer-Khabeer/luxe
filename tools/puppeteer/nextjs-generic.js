module.exports = async (browser, context) => {
  const url = context.url;
  
  if (!url) {
    throw new Error('No URL provided in context');
  }
  
  const pages = await browser.pages();
  const page = pages[pages.length - 1];
  
  console.log('Preparing Next.js page:', url);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const consentSelectors = [
      'button[aria-label*="Accept"]',
      'button[aria-label*="accept"]',
      '#onetrust-accept-btn-handler'
    ];
    
    for (const selector of consentSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        break;
      } catch {}
    }
  } catch {}
  
  try {
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 });
  } catch {}
  
  console.log('Page prepared for Lighthouse measurement');
};
