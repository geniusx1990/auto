import { defineConfig, devices } from '@playwright/test';
import {BASE_URL} from "./utils/const";


const VIEWPORTS = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
];

const WORKERS = 4;

export default defineConfig({
    testDir: './tests',

    fullyParallel: true,
    forbidOnly: false,
    retries: 0,

    workers: WORKERS,

    reporter: [
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
    ],

    outputDir: 'test-results/artifacts',

    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },


    projects: VIEWPORTS.flatMap(v => [
        {
            name: `Chrome ${v.width}x${v.height}`,
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
                viewport: v,
            },
        },
        {
            name: `Firefox ${v.width}x${v.height}`,
            use: {
                ...devices['Desktop Firefox'],
                viewport: v,
            },
        },
    ]),
});
