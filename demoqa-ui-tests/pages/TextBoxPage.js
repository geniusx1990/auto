import BasePage from './BasePage.js';
import {BASE_URL, TEXTBOX_URL} from "../utils/const";

export default class TextBoxPage extends BasePage {
    url = `${BASE_URL}/${TEXTBOX_URL}`;

    constructor(page) {
        super(page);

        this.name = page.locator('#userName');
        this.email = page.locator('#userEmail');
        this.currentAddress = page.locator('#currentAddress');
        this.permanentAddress = page.locator('#permanentAddress');
        this.submit = page.locator('#submit');

        this.output = page.locator('#output');
        this.outName = page.locator('#output #name');
        this.outEmail = page.locator('#output #email');
        this.outCurrent = page.locator('#output #currentAddress');
        this.outPermanent = page.locator('#output #permanentAddress');
    }

    async open() {
        await this.navigateTo(this.url);
    }

    async fillForm({fullName, email, currentAddress, permanentAddress} = {}) {
        if (fullName !== undefined) await this.name.fill(fullName);
        if (email !== undefined) await this.email.fill(email);
        if (currentAddress !== undefined) await this.currentAddress.fill(currentAddress);
        if (permanentAddress !== undefined) await this.permanentAddress.fill(permanentAddress);
    }

    async submitForm() {
        await this.submit.scrollIntoViewIfNeeded();
        await this.submit.click();
    }

    async outputVisible(timeout = 1500) {
        try {
            await this.output.waitFor({state: 'visible', timeout});
            return true;
        } catch {
            return false;
        }
    }

    _stripPrefix(text, prefix) {
        return (text ?? '').replace(prefix, '').trim();
    }

    async readResult() {
        const [name, email, current, permanent] = await Promise.all([
            this.outName.textContent(),
            this.outEmail.textContent(),
            this.outCurrent.textContent(),
            this.outPermanent.textContent(),
        ]);

        return {
            fullName: this._stripPrefix(name, 'Name:'),
            email: this._stripPrefix(email, 'Email:'),
            currentAddress: this._stripPrefix(current, 'Current Address :'),
            permanentAddress: this._stripPrefix(permanent, 'Permananet Address :'),
        };
    }
}
