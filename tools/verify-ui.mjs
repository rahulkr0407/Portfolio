import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BROWSER = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE_URL ?? 'http://localhost:4200';
const OUT = 'C:/Users/RAHULK~1/AppData/Local/Temp/opencode/portfolio-shots';
mkdirSync(OUT, { recursive: true });

const SECTION_IDS = ['home', 'about', 'experience', 'skills', 'projects', 'education', 'contact'];

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const results = [];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
  });

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForSelector('#home', { timeout: 15000 });
  await page.waitForTimeout(1200);

  // A fresh session shows the entry screen (once) and locks scroll — dismiss it.
  let introDismissed = 'absent';
  const intro = page.locator('.intro').first();
  if ((await intro.count()) && (await intro.isVisible())) {
    introDismissed = 'present';
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    const removed = (await page.locator('.intro').count()) === 0
      && !(await page.evaluate(() => document.body.classList.contains('modal-open')));
    introDismissed = removed ? 'dismissed' : 'stuck';
  }

  const metrics = await page.evaluate((ids) => {
    const doc = document.documentElement;
    const sections = Object.fromEntries(ids.map((id) => [id, !!document.getElementById(id)]));
    const branches = document.querySelector('.tree__branches');
    const contact = document.querySelector('.contact__grid');
    const burger = document.querySelector('[aria-label="Toggle navigation menu"]');
    const stats = document.querySelector('.about__stats');
    return {
      overflowX: doc.scrollWidth - doc.clientWidth,
      height: doc.scrollHeight,
      sections,
      skillsGridColumns: branches ? getComputedStyle(branches).gridTemplateColumns : 'n/a',
      skillBranches: document.querySelectorAll('.tree__branch').length,
      skillNodes: document.querySelectorAll('.tree__node').length,
      careerLogs: document.querySelectorAll('.log__entry').length,
      contactGridColumns: contact ? getComputedStyle(contact).gridTemplateColumns : 'n/a',
      statsGridColumns: stats ? getComputedStyle(stats).gridTemplateColumns : 'n/a',
      burgerDisplay: burger ? getComputedStyle(burger).display : 'missing',
      marquee: !!document.querySelector('app-marquee .marquee'),
      scrollProgress: !!document.querySelector('app-scroll-progress .scroll-progress'),
      educationItems: document.querySelectorAll('.education__item').length,
      projectCards: document.querySelectorAll('.mission--card').length,
      featuredProject: !!document.querySelector('.mission--primary'),
      ambient: !!document.querySelector('app-ambient .ambient__canvas'),
      buttonContent: [...document.querySelectorAll('.btn')].every(
        (el) => (el.textContent || '').trim().length > 0,
      ),
    };
  }, SECTION_IDS);

  const missing = SECTION_IDS.filter((id) => !metrics.sections[id]);

  let scrollSpyActive = '';
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  scrollSpyActive = await page.evaluate(
    () => document.querySelector('.navbar__link.is-active .navbar__link-label')?.textContent?.trim() ?? '',
  );

  let skillTree = 'not-tested';
  const branches = page.locator('.tree__branch');
  if (await branches.count()) {
    await branches.nth(1).scrollIntoViewIfNeeded();
    await branches.nth(1).click({ timeout: 5000 });
    await page.waitForTimeout(300);
    const selected = await branches.nth(1).getAttribute('aria-selected');
    const panelId = await page.locator('[role="tabpanel"]').getAttribute('id');
    skillTree = selected === 'true' && panelId === 'skill-panel-1' ? 'ok' : 'broken';
  }

  let palette = 'not-tested';
  const cmdBtn = page.getByRole('button', { name: /command palette/i }).first();
  if (await cmdBtn.count()) {
    await cmdBtn.scrollIntoViewIfNeeded();
    await cmdBtn.click({ timeout: 5000 });
    await page.waitForTimeout(400);
    const paletteVisible = await page.locator('.palette__panel').isVisible();
    const paletteLocked = await page.evaluate(() => document.body.classList.contains('modal-open'));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(350);
    const paletteClosed = (await page.locator('.palette__panel').count()) === 0;
    palette = paletteVisible && paletteLocked && paletteClosed ? 'ok' : 'broken';
  }

  let anchorWorks = false;
  const anchor = page.locator('a.btn[href="#projects"]').first();
  if (await anchor.count()) {
    await anchor.scrollIntoViewIfNeeded();
    await anchor.click({ timeout: 5000 });
    await page.waitForTimeout(1800);
    anchorWorks = await page.evaluate(() => {
      const rect = document.getElementById('projects')?.getBoundingClientRect();
      if (!rect) return false;
      return rect.top > -20 && rect.top < innerHeight * 0.45;
    });
  }

  let resumeLink = false;
  const resume = page.locator('a.btn[href="/Rahul_Kumar_Resume.pdf"]').first();
  if (await resume.count()) {
    resumeLink = await resume.getAttribute('target') === '_blank';
  }

  let modal = 'not-tested';
  const openStudy = page.getByRole('button', { name: /Open briefing/i }).first();
  if (await openStudy.count()) {
    await openStudy.scrollIntoViewIfNeeded();
    await openStudy.click({ timeout: 5000 });
    await page.waitForTimeout(600);
    const modalVisible = await page.locator('.modal__panel').isVisible();
    const scrollLocked = await page.evaluate(() => document.body.classList.contains('modal-open'));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const modalClosed = (await page.locator('.modal__panel').count()) === 0;
    const scrollUnlocked = await page.evaluate(() => !document.body.classList.contains('modal-open'));
    modal = modalVisible && scrollLocked && modalClosed && scrollUnlocked ? 'ok' : 'broken';
  }

  let progressBar = false;
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' }));
  await page.waitForTimeout(300);
  progressBar = await page.evaluate(() => {
    const el = document.querySelector('.scroll-progress');
    if (!el) return false;
    const p = parseFloat(el.style.getPropertyValue('--progress')) || 0;
    return p > 1;
  });

  let statsCountUp = false;
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1700);
  statsCountUp = await page.evaluate(() => {
    const nums = [...document.querySelectorAll('.about__stats .count-up__number')];
    return nums.length === 4 && nums.every((n) => parseFloat(n.textContent) > 0);
  });

  await page.screenshot({ path: `${OUT}/${vp.name}.png`, fullPage: true });
  results.push({
    viewport: vp.name,
    introDismissed,
    overflowX: metrics.overflowX,
    missingSections: missing,
    marquee: metrics.marquee,
    scrollProgress: metrics.scrollProgress,
    progressBar,
    educationItems: metrics.educationItems,
    projectCards: metrics.projectCards,
    featuredProject: metrics.featuredProject,
    buttonContent: metrics.buttonContent,
    statsCountUp,
    brakedown: {
      skillsGrid: metrics.skillsGridColumns,
      skillBranches: metrics.skillBranches,
      skillNodes: metrics.skillNodes,
      careerLogs: metrics.careerLogs,
      contactGrid: metrics.contactGridColumns,
      statsGrid: metrics.statsGridColumns,
      burger: metrics.burgerDisplay,
    },
    ambient: metrics.ambient,
    skillTree,
    palette,
    scrollSpyAfterProjects: scrollSpyActive,
    anchorNavigation: anchorWorks,
    resumeLink,
    modal,
    errors,
  });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));