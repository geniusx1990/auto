import BasePage from './BasePage.js';
import {BASE_URL} from "../utils/const";

export default class MainPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.headerLocator = page.locator('header');

        this.categoryCardLocator = (cardName) =>
            page.locator(`//div[contains(@class, "card")]//*[contains(normalize-space(.), "${cardName}")]`);

        this.listElement = (element) =>
            page.locator(`//span[contains(normalize-space(.), "${element}")]`).first();

        this.expandedGroupLocator = (group) =>
            page.locator(
                `//div[contains(normalize-space(.), "${group}")]/following::div[contains(@class, "element-list")][1]`,
            );

        this.categoryCard = (name) =>
            page.locator('.card', {has: page.locator(`text=${name}`)}).first();

        this.leftMenuItemCss = (name) =>
            page.locator('.element-list span', {hasText: name}).first();
    }

    async open() {
        await this.page.goto(BASE_URL, {waitUntil: 'domcontentloaded'});
        await this.waitForElementVisible(this.headerLocator);
    }

    async checkCategoryCard(cardName) {
        const card = this.categoryCardLocator(cardName);
        await this.waitForElementVisible(card);
        return this.isElementVisible(card);
    }

    async clickCategoryCard(category) {
        const css = this.categoryCard(category);
        if (await css.isVisible().catch(() => false)) {
            await css.click();
            return;
        }

        const xpath = this.categoryCardLocator(category);
        await xpath.waitFor({state: 'visible'});
        await xpath.click();
    }

    async clickCategory(name) {
        return this.clickCategoryCard(name);
    }

    async clickOnElementCardList(element) {
        const cssItem = this.leftMenuItemCss(element);
        if (await cssItem.isVisible().catch(() => false)) {
            await cssItem.click();
            return;
        }

        const xpathItem = this.listElement(element);
        await xpathItem.waitFor({state: 'visible'});
        await xpathItem.click();
    }

    async clickLeftMenu(name) {
        return this.clickOnElementCardList(name);
    }

    async openLeftGroup(groupName) {
        const group = this.page.locator('.element-group', {hasText: groupName}).first();

        if (await group.isVisible().catch(() => false)) {
            await group.click();
            return;
        }

        const container = this.expandedGroupLocator(groupName);
        await container.waitFor({state: 'visible'});
    }
}
