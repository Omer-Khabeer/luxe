// tools/puppeteer/wp-checkout.js
// Prepares WooCommerce checkout for Lighthouse: adds a product to cart before each Lighthouse run.

const PDP_SLUG = "/badami-pistazien-gerostet-und-gesalzen/";
const ADD_TO_CART_SELECTOR = 'form.cart button[type="submit"], button[name="add-to-cart"]';

module.exports = async (browser, context) => {
  const url = context.url;
  
  if (!url) {
    throw new Error('No URL provided in context');
  }
  
  const pages = await browser.pages();
  const page = pages[pages.length - 1];
  const base = new URL(url).origin;

  console.log('Setting up cart with product...');

  // Product page → add to cart
  await page.goto(base + PDP_SLUG, {waitUntil: 'networkidle0'});
  
  // Handle cookie consent
  try {
    await page.click('button[aria-label="Accept all"], button[aria-label="Akzeptieren"], #onetrust-accept-btn-handler', {timeout: 2000});
  } catch {}

  // Add to cart
  try {
    await page.waitForSelector(ADD_TO_CART_SELECTOR, {timeout: 4000});
    await page.click(ADD_TO_CART_SELECTOR);
    await page.waitForNetworkIdle({idleTime: 1000, timeout: 10000});
  } catch {
    // Fallback: use URL parameter
    try {
      const id = await page.evaluate(() => {
        const btn = document.querySelector('button[name="add-to-cart"][data-product_id]');
        return btn ? btn.getAttribute('data-product_id') : null;
      });
      if (id) {
        await page.goto(`${base}/?add-to-cart=${id}`, {waitUntil: 'networkidle0'});
        await page.waitForNetworkIdle({idleTime: 1000, timeout: 10000});
      }
    } catch {}
  }

  console.log('Cart prepared, Lighthouse will now measure:', url);
  
  // Don't navigate to checkout here - let Lighthouse do it with the cart cookie set
  // Just wait a moment for cart state to be saved
  await new Promise(resolve => setTimeout(resolve, 1000));
};
