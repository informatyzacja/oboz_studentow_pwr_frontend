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
      
            // item.loading = true;
            
            var auth = { "Authorization" : 'Token d5ee83538b357e350221f46aa6d3421f62c95ccc' };

            fetch('http://192.168.0.34:8000/api/' + item.url, { headers : auth })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Something went wrong');
            })
            .then(data => {
              item.loading = false
              item.response = data
              item.error = null
            })
            .catch(error => {
              item.loading = false
              item.error = error
              console.error("There was an error!", error);
            })
            .finally(() => {
              item.loading = false
            })
        },
    },
  })