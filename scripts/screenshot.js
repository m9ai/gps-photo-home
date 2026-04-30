const { chromium } = require('playwright');
const path = require('path');

const plans = [
  { name: 'lifetime', label: 'Lifetime License', price: '$49.99' },
  { name: 'yearly', label: 'Yearly License', price: '$29.99/yr' },
  { name: 'monthly', label: 'Monthly License', price: '$3.99/mo' }
];

async function screenshotGumroad(browser, all = false) {
  const targets = all ? plans : [plans[0]];
  const page = await browser.newPage();

  for (const plan of targets) {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('file://' + path.resolve(__dirname, '../gumroad-cover.html'));
    await page.evaluate((label) => {
      const el = document.querySelector('.badge');
      if (el) el.textContent = label;
    }, plan.label);
    await page.screenshot({
      path: path.resolve(__dirname, `../images/gumroad-cover-${plan.name}.png`),
      clip: { x: 0, y: 0, width: 1280, height: 720 }
    });
    console.log(`images/gumroad-cover-${plan.name}.png (1280x720)`);

    await page.setViewportSize({ width: 600, height: 600 });
    await page.goto('file://' + path.resolve(__dirname, '../gumroad-thumbnail.html'));
    await page.evaluate((label) => {
      const el = document.querySelector('.subtitle');
      if (el) el.textContent = label;
    }, plan.label);
    await page.screenshot({
      path: path.resolve(__dirname, `../images/gumroad-thumbnail-${plan.name}.png`),
      clip: { x: 0, y: 0, width: 600, height: 600 }
    });
    console.log(`images/gumroad-thumbnail-${plan.name}.png (600x600)`);
  }

  await page.close();
}

async function screenshotPromo(browser) {
  const page = await browser.newPage();

  await page.setViewportSize({ width: 440, height: 280 });
  await page.goto('file://' + path.resolve(__dirname, '../promo-small.html'));
  await page.screenshot({
    path: path.resolve(__dirname, '../images/promo-small.png'),
    clip: { x: 0, y: 0, width: 440, height: 280 }
  });
  console.log('images/promo-small.png (440x280)');

  await page.setViewportSize({ width: 1400, height: 560 });
  await page.goto('file://' + path.resolve(__dirname, '../promo-large.html'));
  await page.screenshot({
    path: path.resolve(__dirname, '../images/promo-large.png'),
    clip: { x: 0, y: 0, width: 1400, height: 560 }
  });
  console.log('images/promo-large.png (1400x560)');

  await page.close();
}

(async () => {
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const isGumroad = args.includes('--gumroad');
  const isPromo = args.includes('--promo');

  const browser = await chromium.launch();

  if (isAll) {
    await screenshotGumroad(browser, true);
    await screenshotPromo(browser);
  } else if (isGumroad) {
    await screenshotGumroad(browser, true);
  } else if (isPromo) {
    await screenshotPromo(browser);
  } else {
    await screenshotGumroad(browser, false);
  }

  await browser.close();
})();
