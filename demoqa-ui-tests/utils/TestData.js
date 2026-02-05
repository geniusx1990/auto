export default class TestData {
    static firstNames = [
        'Liam', 'Noah', 'Oliver', 'Ethan', 'Lucas', 'Mason', 'Logan', 'James',
        'Ava', 'Sophia', 'Mia', 'Isabella', 'Amelia', 'Charlotte', 'Harper', 'Emily',
    ];

    static lastNames = [
        'Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White',
        'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Lewis',
    ];

    static genders = ['Male', 'Female', 'Other'];

    static emailDomains = ['autotest.dev', 'qa-mail.com', 'testing.io', 'example.com'];

    static months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateFirstName() {
        return this.getRandomElement(this.firstNames);
    }

    static generateLastName() {
        return this.getRandomElement(this.lastNames);
    }

    static generateEmail(firstName = null, lastName = null) {
        const first = firstName || this.generateFirstName();
        const last = lastName || this.generateLastName();
        const domain = this.getRandomElement(this.emailDomains);
        return `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`;
    }

    static generateGender() {
        return this.getRandomElement(this.genders);
    }

    static generateMobile() {
        return String(this.getRandomNumber(1000000000, 9999999999));
    }

    static generateDateOfBirth() {
        const day = this.getRandomNumber(1, 28);
        const month = this.getRandomElement(this.months);
        const year = String(this.getRandomNumber(1950, 2005));
        return {day, month, year};
    }

    static generateAddress() {
        const streetNumber = this.getRandomNumber(1, 9999);
        const streets = [
            'Oak Street',
            'Maple Avenue',
            'Cedar Road',
            'Pine Lane',
            'Sunset Boulevard',
            'Hillcrest Drive',
        ];
        return `${streetNumber} ${this.getRandomElement(streets)}`;
    }

    static generateSubjects() {
        const allSubjects = ['Maths', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Economics'];
        const count = this.getRandomNumber(1, 3);
        const shuffled = [...allSubjects].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    static generateHobbies() {
        const allHobbies = ['Sports', 'Reading', 'Music'];
        const count = this.getRandomNumber(1, 2);
        const shuffled = [...allHobbies].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    static generateCompleteFormData() {
        const firstName = this.generateFirstName();
        const lastName = this.generateLastName();
        const email = this.generateEmail(firstName, lastName);
        const gender = this.generateGender();
        const mobile = this.generateMobile();
        const dob = this.generateDateOfBirth();
        const address = this.generateAddress();
        const subjects = this.generateSubjects();
        const hobbies = this.generateHobbies();

        return {
            firstName,
            lastName,
            email,
            gender,
            mobile,
            birthDay: dob.day,
            birthMonth: dob.month,
            birthYear: dob.year,
            address,
            subjects,
            hobbies,
        };
    }

    static generateMinimalFormData() {
        return {
            firstName: this.generateFirstName(),
            lastName: this.generateLastName(),
            gender: this.generateGender(),
            mobile: this.generateMobile(),
        };
    }

    static generateTextBoxData() {
        const firstName = this.generateFirstName();
        const lastName = this.generateLastName();

        return {
            fullName: `${firstName} ${lastName}`,
            email: this.generateEmail(firstName, lastName),
            currentAddress: this.generateAddress(),
            permanentAddress: this.generateAddress(),
        };
    }
}
