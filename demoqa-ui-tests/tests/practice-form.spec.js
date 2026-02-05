import { test, expect } from '@playwright/test';
import { PracticeFormPage, MainPage } from '../pages';
import { CityandStateData, TestData } from '../utils';
import path from 'path';

test.beforeEach(async ({ page }) => {
    await page.route('**/*', route => {
        const url = route.request().url();
        if (url.includes('googlesyndication') || url.includes('doubleclick') || url.includes('/ads')) {
            return route.abort();
        }
        return route.continue();
    });

    const main = new MainPage(page);
    await main.open();
});

test.describe('Automation Practice Form', () => {
    let testImagePath;

    test.beforeAll(() => {
        testImagePath = path.join(process.cwd(), 'test-files', 'sample-png-file.png');
    });

    test.beforeEach(async ({ page }) => {
        const mainPage = new MainPage(page);
        const formPage = new PracticeFormPage(page);

        await test.step('Open Practice Form', async () => {
            await mainPage.clickCategory('Forms');
            await mainPage.clickLeftMenu('Practice Form');
        });

        await test.step('Prepare page', async () => {
            await formPage.blockAds();
            expect(await formPage.verifyFormHeader()).toBe(true);
        });
    });

    test('Positive: required fields only', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const data = TestData.generateMinimalFormData();

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.selectGender(data.gender);
        await formPage.fillMobile(data.mobile);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(true);

        const modal = await formPage.getModalData();
        expect(modal['Student Name']).toBe(`${data.firstName} ${data.lastName}`);
        expect(modal['Gender']).toBe(data.gender);
        expect(modal['Mobile']).toBe(data.mobile);
    });

    test('Positive: basic flow (email + dob + address + state/city)', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const data = TestData.generateCompleteFormData();
        const sc = CityandStateData.getRandomStateCityWithAddress();

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.fillEmail(data.email);
        await formPage.selectGender(data.gender);
        await formPage.fillMobile(data.mobile);

        await formPage.selectDateOfBirth(data.birthDay, data.birthMonth, data.birthYear);

        await formPage.fillCurrentAddress(sc.address);
        await formPage.selectState(sc.state);
        await formPage.selectCity(sc.city);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(true);

        const modal = await formPage.getModalData();
        expect(modal['Student Name']).toBe(`${data.firstName} ${data.lastName}`);
        expect(modal['Student Email']).toBe(data.email);
        expect(modal['Gender']).toBe(data.gender);
        expect(modal['Mobile']).toBe(data.mobile);
        expect(modal['Address']).toBe(sc.address);
        expect(modal['State and City']).toBe(CityandStateData.formatStateCityResult(sc.state, sc.city));
        expect(modal['Date of Birth']).toBeTruthy();
    });

    test('Positive: file upload', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const data = TestData.generateMinimalFormData();
        const sc = CityandStateData.getRandomStateCityWithAddress();

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.selectGender(data.gender);
        await formPage.fillMobile(data.mobile);

        await formPage.fillCurrentAddress(sc.address);
        await formPage.selectState(sc.state);
        await formPage.selectCity(sc.city);

        await formPage.uploadFile(testImagePath);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(true);

        const modal = await formPage.getModalData();
        expect(modal['Picture']).toBe('sample-png-file.png');
    });

    test('Positive: hobbies', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const data = TestData.generateMinimalFormData();

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.selectGender(data.gender);
        await formPage.fillMobile(data.mobile);

        await formPage.selectHobbies(['Sports']);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(true);

        const modal = await formPage.getModalData();
        expect(modal['Hobbies']).toContain('Sports');
    });

    test('Negative: empty submit', async ({ page }) => {
        const formPage = new PracticeFormPage(page);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(false);
    });

    test('Negative: missing gender', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const data = TestData.generateMinimalFormData();

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.fillMobile(data.mobile);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(false);
    });

    test('Negative: invalid email', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const data = TestData.generateMinimalFormData();

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.fillEmail('invalid-email-format');
        await formPage.selectGender(data.gender);
        await formPage.fillMobile(data.mobile);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(false);

        await formPage.hasEmailValidationError();
    });

    test('Negative: invalid mobile', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const data = TestData.generateMinimalFormData();

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.selectGender(data.gender);
        await formPage.fillMobile('123');

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(false);

        await formPage.hasMobileValidationError();
    });

    test('State/City dependency', async ({ page }) => {
        const formPage = new PracticeFormPage(page);
        const stateCity = CityandStateData.getFixedStateCity();
        const data = TestData.generateMinimalFormData();

        expect(await formPage.isCityDropdownDisabled()).toBe(true);

        await formPage.selectState(stateCity.state);
        expect(await formPage.isCityDropdownDisabled()).toBe(false);

        await formPage.selectCity(stateCity.city);

        await formPage.fillFirstName(data.firstName);
        await formPage.fillLastName(data.lastName);
        await formPage.selectGender(data.gender);
        await formPage.fillMobile(data.mobile);

        await formPage.submitForm();
        expect(await formPage.isModalVisible()).toBe(true);

        const modal = await formPage.getModalData();
        expect(modal['State and City']).toBe(CityandStateData.formatStateCityResult(stateCity.state, stateCity.city));
    });
});
