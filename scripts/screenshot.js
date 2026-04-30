const { chromium } = require('playwright');
const path = require('path');

const plans = [
  { name: 'lifetime', label: 'Lifetime License', price: '$49.99' },
  { name: 'yearly', label: 'Yearly License', price: '$29.99/yr' },
  { name: 'monthly', label: 'Monthly License', price: '$3.99/mo' }
];

(async () => {
  const isAll = process.argv.includes('--all');
  const targets = isAll ? plans : [plans[0]];

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const plan of targets) {
    // Screenshot cover: 1280x720
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('file://' + path.resolve(__dirname, '../gumroad-cover.html'));
    // Update label text dynamically
    await page.evaluate((label) => {
      const el = document.querySelector('.badge');
      if (el) el.textContent = label;
    }, plan.label);
    const coverPath = path.resolve(__dirname, `../images/gumroad-cover-${plan.name}.png`);
    await page.screenshot({
      path: coverPath,
      clip: { x: 0, y: 0, width: 1280, height: 720 }
    });
    console.log(`Cover saved: images/gumroad-cover-${plan.name}.png (1280x720)`);

    // Screenshot thumbnail: 600x600
    await page.setViewportSize({ width: 600, height: 600 });
    await page.goto('file://' + path.resolve(__dirname, '../gumroad-thumbnail.html'));
    await page.evaluate((label) => {
      const el = document.querySelector('.subtitle');
      if (el) el.textContent = label;
    }, plan.label);
    const thumbPath = path.resolve(__dirname, `../images/gumroad-thumbnail-${plan.name}.png`);
    await page.screenshot({
      path: thumbPath,
      clip: { x: 0, y: 0, width: 600, height: 600 }
    });
    console.log(`Thumbnail saved: images/gumroad-thumbnail-${plan.name}.png (600x600)`);
  }

  await browser.close();
})();
