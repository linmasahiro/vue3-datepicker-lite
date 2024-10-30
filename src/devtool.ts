import { App, Plugin } from 'vue';

const devtools: Plugin = {
    install(app: App) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (process.env.NODE_ENV === 'development' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;
        }
    },
};

export { devtools };