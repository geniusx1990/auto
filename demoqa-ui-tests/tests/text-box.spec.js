import {test, expect} from '@playwright/test';
import TextBoxPage from '../pages/TextBoxPage.js';
import {TestData} from '../utils/index.js';

test.beforeEach(async ({page}) => {
    await page.route('**/*', route => {
        const url = route.request().url();
        const isAd =
            url.includes('googlesyndication') ||
            url.includes('doubleclick') ||
            url.includes('/ads') ||
            url.includes('adsystem');

        return isAd ? route.abort() : route.continue();
    });
});

test.describe('Text Box', () => {
    test('happy path: fill all fields and check output', async ({page}) => {
        const tb = new TextBoxPage(page);
        const data = TestData.generateTextBoxData();

        await test.step('open page', async () => {
            await tb.open();
        });

        await test.step('fill + submit', async () => {
            await tb.fillForm(data);
            await tb.submitForm();
        });

        await test.step('verify output', async () => {
            await expect(tb.output).toBeVisible();
            const result = await tb.readResult();
            expect(result).toEqual(data);
        });
    });


    test('negative: submit empty form -> output should not appear', async ({page}) => {
        const tb = new TextBoxPage(page);

        await tb.open();
        await tb.submitForm();

        await expect(tb.output).toBeHidden();

    });

    test('negative: invalid email blocks submit', async ({page}) => {
        const tb = new TextBoxPage(page);
        const data = TestData.generateTextBoxData();

        await tb.open();
        await tb.fillForm({...data, email: 'invalid-email'});
        await tb.submitForm();

        await expect(tb.output).toBeHidden();
    });

    test('read individual fields', async ({page}) => {
        const tb = new TextBoxPage(page);
        const data = TestData.generateTextBoxData();

        await tb.open();
        await tb.fillForm(data);
        await tb.submitForm();

        const result = await tb.readResult();
        expect(result.fullName).toBe(data.fullName);
        expect(result.email).toBe(data.email);
        expect(result.currentAddress).toBe(data.currentAddress);
        expect(result.permanentAddress).toBe(data.permanentAddress);
    });
});
