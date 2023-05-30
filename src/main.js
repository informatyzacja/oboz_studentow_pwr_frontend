import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Global functions
app.mixin({
    methods: {
        async loadData(item) {
      
            item.loading = true;
            
            var auth = { "Authorization" : 'Token d5ee83538b357e350221f46aa6d3421f62c95ccc' };
            const response = await fetch('http://127.0.0.1:8000/api/' + item.url, { headers : auth })

            response.json().then(data => {
              item.response = data
              item.error = null
            })
            .catch(error => {
              item.error = error
            })
            .finally(() => {
              item.loading = false
            })
        },
    },
  })