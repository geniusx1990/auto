import { test, expect } from '@playwright/test';
import { SelectMenuPage } from '../pages';
import AdBlock from '../utils/AdBlock.js';

test.beforeEach(async ({ page }) => {
    await Promise.race([
        AdBlock.blockAds(page),
        page.waitForTimeout(1500),
    ]).catch(() => {});
});

test.describe('Select Menu', () => {
    test('User selects values in all dropdowns', async ({ page }) => {
        const menu = new SelectMenuPage(page);

        await test.step('Open page', async () => {
            await menu.open();
        });

        await test.step('Select Value → Group 2, option 1', async () => {
            await menu.selectValueOption('Group 2, option 1');
            expect(await menu.readSelectedValue()).toBe('Group 2, option 1');
        });

        await test.step('Select One → Other', async () => {
            await menu.selectSingleOption('Other');
            expect(await menu.readSingleValue()).toBe('Other');
        });

        await test.step('Old Style Select Menu → Green', async () => {
            await menu.selectClassicOption('Green');
            expect(await menu.readClassicValue()).toBe('Green');
        });

        await test.step('Multiselect → Black, Blue', async () => {
            await menu.selectMultiple(['Black', 'Blue']);
            const values = await menu.readMultiValues();

            expect(values).toEqual(expect.arrayContaining(['Black', 'Blue']));
            expect(values).toHaveLength(2);
        });
    });

    test('Negative: default placeholders are visible', async ({ page }) => {
        const menu = new SelectMenuPage(page);

        await menu.open();

        const valueText = await menu.ui.valueDropdown.textContent();
        const oneText = await menu.ui.oneDropdown.textContent();

        expect(valueText).toContain('Select');
        expect(oneText).toContain('Select');
    });

    test('Negative: single select replaces previous choice', async ({ page }) => {
        const menu = new SelectMenuPage(page);

        await menu.open();

        await menu.selectSingleOption('Mrs.');
        expect(await menu.readSingleValue()).toBe('Mrs.');

        await menu.selectSingleOption('Other');
        const current = await menu.readSingleValue();

        expect(current).toBe('Other');
        expect(current).not.toBe('Mrs.');
    });

    test('Positive: multiselect supports 3 values', async ({ page }) => {
        const menu = new SelectMenuPage(page);

        await menu.open();

        await menu.selectMultiple(['Red', 'Green', 'Blue']);
        const values = await menu.readMultiValues();

        expect(values).toEqual(expect.arrayContaining(['Red', 'Green', 'Blue']));
        expect(values).toHaveLength(3);
    });
});
