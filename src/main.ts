import { createApp } from 'vue'
import App from './App.vue'
import { devtools } from './devtool';

createApp(App).use(devtools).mount('#app');