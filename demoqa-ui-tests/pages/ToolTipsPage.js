import BasePage from './BasePage.js';
import { expect } from '@playwright/test';
import {BASE_URL, TOOLTIP_URL} from "../utils/const";

export default class ToolTipsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.url = `${BASE_URL}/${TOOLTIP_URL}`;

        this.toolTipButton = page.locator('#toolTipButton');
        this.toolTipTextField = page.locator('#toolTipTextField');
        this.contraryLink = page.locator('a', { hasText: 'Contrary' });
        this.sectionLink = page.locator('a', { hasText: '1.10.32' });

        this.tooltip = page.locator('[role="tooltip"]');
        this.tooltipInner = this.tooltip.locator('.tooltip-inner');
    }

    async open() {
        await this.navigateTo(this.url);
        await this.page.waitForLoadState('domcontentloaded');
        await this.toolTipButton.waitFor({ state: 'visible' });
    }

    async clearTooltip() {
        await this.page.mouse.move(0, 0);
        await this.page.mouse.move(0, 500);
        await expect(this.tooltip).toBeHidden({ timeout: 2000 });
    }

    async hoverAndGetTooltipText(target) {
        await this.clearTooltip();

        await target.scrollIntoViewIfNeeded();
        await target.hover();

        await expect(this.tooltip).toBeVisible({ timeout: 3000 });
        await expect(this.tooltipInner).toBeVisible();

        return (await this.tooltipInner.textContent()).trim();
    }

    async showTooltip(target) {
        await this.clearTooltip();
        await target.scrollIntoViewIfNeeded();
        await target.hover();
        await expect(this.tooltip).toBeVisible({ timeout: 5000 });
    }

    getButtonTooltipText() {
        return this.hoverAndGetTooltipText(this.toolTipButton);
    }

    getTextFieldTooltipText() {
        return this.hoverAndGetTooltipText(this.toolTipTextField);
    }

    getContraryLinkTooltipText() {
        return this.hoverAndGetTooltipText(this.contraryLink);
    }

    getSectionLinkTooltipText() {
        return this.hoverAndGetTooltipText(this.sectionLink);
    }
}
