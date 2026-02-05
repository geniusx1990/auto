import BasePage from './BasePage.js';
import {BASE_URL, SELECT_MENU_URL} from "../utils/const";

export default class SelectMenuPage extends BasePage {
    constructor(page) {
        super(page);

        this.url = `${BASE_URL}/${SELECT_MENU_URL}`;

        this.ui = {
            valueDropdown: page.locator('#withOptGroup'),
            oneDropdown: page.locator('#selectOne'),
            classicSelect: page.locator('#oldSelectMenu'),

            multiControl: page.locator('#selectMenuContainer div[class*="control"]').last(),
        };

        this.ui.multiInput = this.ui.multiControl.locator('input[id*="react-select"][id$="-input"]');

        this.display = {
            value: this.ui.valueDropdown.locator("[class*='singleValue']"),
            one: this.ui.oneDropdown.locator("[class*='singleValue']"),
            classic: this.ui.classicSelect.locator('option:checked'),
        };

        this.ui.multiTags = page.locator('#selectMenuContainer div[class*="multiValue"]');

        this._multiTagByText = (text) =>
            page.locator(`#selectMenuContainer div[class*="multiValue"]:has-text("${text}")`);
    }

    async open() {
        await this.navigateTo(this.url);
    }

    async selectValueOption(label) {
        await this.ui.valueDropdown.click();
        await this.getOptionByText(label).click();
    }

    async selectSingleOption(label) {
        await this.ui.oneDropdown.click();
        await this.getOptionByText(label).click();
    }

    async selectClassicOption(label) {
        await this.ui.classicSelect.selectOption({label});
    }

    async selectMultiple(values) {
        for (const value of values) {
            await this.ui.multiControl.click();

            await this.ui.multiInput.fill(value);

            const option = this.getOptionByText(value);
            await option.waitFor({state: 'visible', timeout: 5000});
            await option.click();

            await this._multiTagByText(value).waitFor({state: 'attached', timeout: 4000});
        }
    }

    async readSelectedValue() {
        await this.display.value.waitFor({state: 'visible'});
        return (await this.display.value.textContent()).trim();
    }

    async readSingleValue() {
        await this.display.one.waitFor({state: 'visible'});
        return (await this.display.one.textContent()).trim();
    }

    async readClassicValue() {
        return (await this.display.classic.textContent()).trim();
    }

    async readMultiValues() {
        const count = await this.ui.multiTags.count();
        const values = [];

        for (let i = 0; i < count; i++) {
            const raw = await this.ui.multiTags.nth(i).textContent();
            values.push(raw.replace('×', '').trim());
        }

        return values;
    }
}
