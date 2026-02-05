import { expect } from '@playwright/test';
import { BasePage } from './index.js';

export default class PracticeFormPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.locators = {
            header: page.locator('.practice-form-wrapper h5', { hasText: 'Student Registration Form' }),

            firstName: page.locator('#firstName'),
            lastName: page.locator('#lastName'),
            email: page.locator('#userEmail'),
            mobile: page.locator('#userNumber'),
            address: page.locator('#currentAddress'),

            dobInput: page.locator('#dateOfBirthInput'),
            dobMonth: page.locator('.react-datepicker__month-select'),
            dobYear: page.locator('.react-datepicker__year-select'),

            subjectsInput: page.locator('#subjectsInput'),

            upload: page.locator('#uploadPicture'),

            state: page.locator('#state'),
            city: page.locator('#city'),
            stateInput: page.locator('#state input[id^="react-select"][id$="input"]'),
            cityInput: page.locator('#city input[id^="react-select"][id$="input"]'),

            submit: page.locator('#submit'),

            modalTitle: page.locator('#example-modal-sizes-title-lg'),
            modalRows: page.locator('.table-responsive tbody tr'),
            modalTable: page.locator('.table-responsive'),
        };
    }

    gender(gender) {
        return this.page.locator('label', { hasText: gender }).first();
    }

    hobby(name) {
        return this.page.locator('label', { hasText: name }).first();
    }

    subjectChip(subject) {
        return this.page.locator('div[class*="multiValue"]', { hasText: subject }).first();
    }

    dateDay(day) {
        const dd = String(day).padStart(2, '0');
        return this.page
            .locator(`.react-datepicker__day--0${dd}:not(.react-datepicker__day--outside-month)`)
            .first();
    }

    async verifyFormHeader() {
        await this.locators.header.waitFor({ state: 'visible' });
        return this.locators.header.isVisible();
    }

    async fillFirstName(value) {
        await this.locators.firstName.fill(value);
    }

    async fillLastName(value) {
        await this.locators.lastName.fill(value);
    }

    async fillEmail(value) {
        await this.locators.email.fill(value);
    }

    async fillMobile(value) {
        await this.locators.mobile.fill(value);
    }

    async fillCurrentAddress(value) {
        await this.locators.address.scrollIntoViewIfNeeded();
        await this.locators.address.fill(value);
    }

    async selectGender(value) {
        await this.gender(value).click();
    }

    /**
     * @param {number} day
     * @param {string|number} month  e.g. "June" or 5
     * @param {string|number} year   e.g. 1995
     */
    async selectDateOfBirth(day, month, year) {
        await this.locators.dobInput.click();

        await this.locators.dobYear.selectOption(String(year));
        await this.locators.dobMonth.selectOption(String(month));

        const dayBtn = this.dateDay(day);
        await expect(dayBtn).toBeVisible();
        await dayBtn.click();
    }

    async addSubject(subject) {
        await this.locators.subjectsInput.click();
        await this.locators.subjectsInput.fill(subject);
        await this.page.keyboard.press('Enter');

        await this.subjectChip(subject).waitFor({ state: 'attached', timeout: 2000 }).catch(() => {});
    }

    async addMultipleSubjects(subjects = []) {
        for (const s of subjects) await this.addSubject(s);
    }

    async selectHobbies(hobbies = []) {
        for (const h of hobbies) {
            await this.hobby(h).click({ force: true });
        }
    }

    async uploadFile(filePathOrBuffer, fileName = 'sample-png-file.png', mimeType = 'image/png') {
        await this.locators.upload.scrollIntoViewIfNeeded();

        if (Buffer.isBuffer(filePathOrBuffer)) {
            await this.locators.upload.setInputFiles({ name: fileName, mimeType, buffer: filePathOrBuffer });
            return;
        }

        await this.locators.upload.setInputFiles(filePathOrBuffer);
    }

    async selectState(stateName) {
        await this.locators.state.scrollIntoViewIfNeeded();
        await this.locators.state.click();
        await this.locators.stateInput.fill(stateName);
        await this.page.keyboard.press('Enter');

        await expect(this.locators.cityInput).toBeVisible();
        await expect(this.locators.cityInput).toBeEnabled();
    }

    async selectCity(cityName) {
        await this.locators.city.click();
        await this.locators.cityInput.fill(cityName);
        await this.page.keyboard.press('Enter');
    }

    async isCityDropdownDisabled() {
        return this.locators.cityInput.isDisabled();
    }

    async submitForm() {
        await this.locators.submit.scrollIntoViewIfNeeded();
        await this.locators.submit.click({ force: true });
    }

    async isModalVisible() {
        return this.locators.modalTitle.isVisible({ timeout: 3000 });
    }

    async getModalData() {
        await this.locators.modalTable.waitFor({ state: 'visible' });

        const rows = await this.locators.modalRows.all();
        const data = {};

        for (const row of rows) {
            const cells = row.locator('td');
            const label = (await cells.nth(0).textContent())?.trim();
            const value = (await cells.nth(1).textContent())?.trim();
            if (label) data[label] = value ?? '';
        }

        return data;
    }

    async hasEmailValidationError() {
        await expect(this.locators.email).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        return true;
    }

    async hasMobileValidationError() {
        await expect(this.locators.mobile).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        return true;
    }

    async fillCompleteForm(formData) {
        await this.fillFirstName(formData.firstName);
        await this.fillLastName(formData.lastName);
        await this.fillEmail(formData.email);
        await this.selectGender(formData.gender);
        await this.fillMobile(formData.mobile);

        await this.selectDateOfBirth(formData.birthDay, formData.birthMonth, formData.birthYear);

        await this.addMultipleSubjects(formData.subjects);
        await this.selectHobbies(formData.hobbies);

        if (formData.picture) await this.uploadFile(formData.picture);

        await this.fillCurrentAddress(formData.address);
        await this.selectState(formData.state);
        await this.selectCity(formData.city);
    }

    async blockAds() {
        await this.page.addStyleTag({
            content: `
        #fixedban,
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        .adsbygoogle {
          display: none !important;
          visibility: hidden !important;
        }
      `,
        });
    }
}
