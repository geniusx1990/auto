import { BasePage } from './index.js';

export default class AlertsPage extends BasePage {
    constructor(page) {
        super(page);

        this.selectors = {
            simpleAlertBtn: page.locator('#alertButton'),
            delayedAlertBtn: page.locator('#timerAlertButton'),
            confirmAlertBtn: page.locator('#confirmButton'),
            promptAlertBtn: page.locator('#promtButton'),
            confirmResultText: page.locator('#confirmResult'),
            promptResultText: page.locator('#promptResult'),
            dialogs: page.locator('dialog[open]'),
            header: page.getByRole('heading', { name: 'Alerts' }),
        };
    }

    async isOpened() {
        await this.selectors.header.waitFor({ state: 'visible' });
        return this.selectors.header.isVisible();
    }

    async _click(locator, options = {}) {
        await locator.scrollIntoViewIfNeeded();
        await locator.waitFor({ state: 'visible' });
        await locator.click(options);
    }

    async openSimpleAlert(options = {}) {
        await this._click(this.selectors.simpleAlertBtn, options);
    }

    async openDelayedAlert(options = {}) {
        await this._click(this.selectors.delayedAlertBtn, options);
    }

    async openConfirmAlert(options = {}) {
        await this._click(this.selectors.confirmAlertBtn, options);
    }

    async openPromptAlert(options = {}) {
        await this._click(this.selectors.promptAlertBtn, options);
    }

    async readConfirmResult() {
        await this.selectors.confirmResultText.waitFor({ state: 'visible' });
        return await this.selectors.confirmResultText.textContent();
    }

    async readPromptResult(timeout = 15000) {
        await this.selectors.promptResultText.waitFor({ state: 'visible', timeout });
        return await this.selectors.promptResultText.textContent();
    }

    async waitForPromptResult(timeout = 15000) {
        return await this.readPromptResult(timeout);
    }

    async hasNoActiveDialogs() {
        const dialogCount = await this.selectors.dialogs.count();
        return dialogCount === 0;
    }
}
