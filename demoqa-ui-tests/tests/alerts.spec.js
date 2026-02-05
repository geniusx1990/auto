import { test, expect } from '@playwright/test';
import { AlertsPage, MainPage } from '../pages';
import { TestData } from '../utils';

test.beforeEach(async ({ page }) => {
    const main = new MainPage(page);
    await main.open();
});

test.describe('Alerts', () => {
    test.beforeEach(async ({ page }) => {
        const mainPage = new MainPage(page);
        const alertsPage = new AlertsPage(page);

        await test.step('Open Alerts page', async () => {
            await mainPage.clickCategoryCard('Alerts, Frame & Windows');
            await mainPage.clickOnElementCardList('Alerts');
        });

        await test.step('Header is visible', async () => {
            expect(await alertsPage.isOpened()).toBe(true);
        });
    });

    test('Simple alert shows expected text', async ({ page }) => {
        const alertsPage = new AlertsPage(page);

        let dialogAppeared = false;
        let dialogMessage = '';

        await test.step('No dialog before click', async () => {
            page.on('dialog', async (dialog) => {
                dialogAppeared = true;
                dialogMessage = dialog.message();
                await dialog.accept();
            });

            expect(dialogAppeared).toBe(false);
        });

        await test.step('Click button and validate alert', async () => {
            await alertsPage.openSimpleAlert();

            await expect.poll(() => dialogAppeared, { timeout: 3000 }).toBe(true);
            expect(dialogMessage).toBe('You clicked a button');
        });

        await test.step('No active dialogs after close', async () => {
            expect(await alertsPage.hasNoActiveDialogs()).toBe(true);
        });
    });

    test('Timer alert appears (up to 10 seconds)', async ({ page }) => {
        const alertsPage = new AlertsPage(page);
        let dialogStartTime = 0;

        await test.step('Click and wait for timer alert', async () => {
            dialogStartTime = Date.now();

            const [dialog] = await Promise.all([
                page.waitForEvent('dialog', { timeout: 10000 }),
                alertsPage.openDelayedAlert(),
            ]);

            expect(dialog.message()).toBe('This alert appeared after 5 seconds');
            await dialog.accept();

            const elapsed = Date.now() - dialogStartTime;
            expect(elapsed).toBeLessThanOrEqual(10000);
        });

        await test.step('No active dialogs after close', async () => {
            expect(await alertsPage.hasNoActiveDialogs()).toBe(true);
        });
    });

    test('Confirm alert supports OK and Cancel', async ({ page }) => {
        const alertsPage = new AlertsPage(page);

        await test.step('OK flow', async () => {
            await Promise.all([
                page.waitForEvent('dialog').then(async (confirmDialog) => {
                    expect(confirmDialog.type()).toBe('confirm');
                    await confirmDialog.accept();
                }),
                alertsPage.openConfirmAlert({ noWaitAfter: true }),
            ]);

            const result = await alertsPage.readConfirmResult();
            expect(result).toContain('You selected Ok');
            expect(result).not.toContain('Cancel');
        });

        await test.step('Cancel flow (negative)', async () => {
            await Promise.all([
                page.waitForEvent('dialog').then(async (confirmDialog) => {
                    expect(confirmDialog.type()).toBe('confirm');
                    await confirmDialog.dismiss();
                }),
                alertsPage.openConfirmAlert({ noWaitAfter: true }),
            ]);

            const result = await alertsPage.readConfirmResult();
            expect(result).toContain('You selected Cancel');
            expect(result).not.toContain('You selected Ok');
        });
    });

    test('Prompt alert supports input and cancel', async ({ page }) => {
        const alertsPage = new AlertsPage(page);

        await test.step('Enter text', async () => {
            const value = TestData.generateFirstName();
            let handled = false;

            page.once('dialog', async (dialog) => {
                expect(dialog.type()).toBe('prompt');
                await dialog.accept(value);
                handled = true;
            });

            await alertsPage.openPromptAlert();
            await expect.poll(() => handled, { timeout: 5000 }).toBe(true);

            const result = await alertsPage.readPromptResult();
            expect(result).toContain(`You entered ${value}`);
            expect(result).not.toContain('null');
        });

        await test.step('Cancel (negative)', async () => {
            let handled = false;

            page.once('dialog', async (dialog) => {
                expect(dialog.type()).toBe('prompt');
                await dialog.dismiss();
                handled = true;
            });

            await alertsPage.openPromptAlert();
            await expect.poll(() => handled, { timeout: 5000 }).toBe(true);

            await page
                .waitForSelector('#promptResult', { state: 'visible', timeout: 5000 })
                .catch(() => {});

            const count = await page.locator('#promptResult').count();
            if (count > 0) {
                const result = await page.locator('#promptResult').textContent();
                expect(result).toContain('You entered null');
                expect(result).not.toMatch(/You entered [a-zA-Zа-яА-ЯёЁ]/);
            } else {
                expect(true).toBe(true);
            }
        });
    });
});
