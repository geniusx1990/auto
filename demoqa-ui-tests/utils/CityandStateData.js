export class CityandStateData {
    static STATE_CITY_MAP = Object.freeze({
        NCR: ['Delhi', 'Gurgaon', 'Noida'],
        'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
        Haryana: ['Karnal', 'Panipat'],
        Rajasthan: ['Jaipur', 'Jaiselmer'],
    });

    static pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    static getAllStates() {
        return Object.keys(this.STATE_CITY_MAP);
    }

    static getCitiesForState(state) {
        return this.STATE_CITY_MAP[state] ?? [];
    }

    static getAllStateCityCombinations() {
        return Object.entries(this.STATE_CITY_MAP).flatMap(([state, cities]) =>
            cities.map(city => ({ state, city })),
        );
    }

    static isValidCombination(state, city) {
        return this.getCitiesForState(state).includes(city);
    }

    static formatStateCityResult(state, city) {
        return `${state} ${city}`;
    }

    static getFixedStateCity() {
        return { state: 'NCR', city: 'Delhi' };
    }

    static getRandomStateCity() {
        const state = this.pick(this.getAllStates());
        const city = this.pick(this.getCitiesForState(state));
        return { state, city };
    }

    static generateAddressForStateCity(state, city) {
        const house = this.pick(['12', '24', '37', '58', '101', '220', '504']);
        const streets = [
            'Oak Street',
            'Maple Avenue',
            'Cedar Road',
            'Pine Lane',
            'Hillcrest Drive',
            'Sunset Boulevard',
            'King’s Road',
            'Baker Street',
        ];

        const street = this.pick(streets);
        return `${house} ${street}, ${city}, ${state}`;
    }

    static getFixedStateCityWithAddress() {
        const { state, city } = this.getFixedStateCity();
        return { state, city, address: this.generateAddressForStateCity(state, city) };
    }

    static getRandomStateCityWithAddress() {
        const { state, city } = this.getRandomStateCity();
        return { state, city, address: this.generateAddressForStateCity(state, city) };
    }
}
