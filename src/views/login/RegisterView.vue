<script setup>
import { IonPage, IonContent, IonSpinner } from '@ionic/vue';
import logo from '@/assets/ikona.png';

import { request } from '@/stores/functions.js';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@capacitor/keyboard';
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <main>
                <img id="logo" :src="logo" alt="logo">

                <div>

                    <h1>Zaloguj się</h1>
                    <p class="info">
                        Podaj adres e-mail, który podałeś/aś podczas rejestracji na obóz.
                    </p>

                    <p v-if="error" class="errors">
                        {{ error }}
                    </p>

                    <input id="email" type="email" autocomplete="email" required class="pill" placeholder="E-MAIL"
                        v-model="email" enterkeyhint="go" @keyup.enter="submit">

                    <button @click="submit" class="pill button" :disabled="loading">
                        <span v-if="!loading">Zaloguj się</span>
                        <ion-spinner v-else name="dots" />
                    </button>

                </div>
            </main>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            error: null,
            loading: false
        }
    },
    async mounted() {
        this.storage = new Storage();
        await this.storage.create();
        if (await this.storage.get('email')) {
            this.$router.push({ name: 'verification-code' })
        }
    },
    methods: {
        submit() {
            Keyboard.hide();
            if (!this.email) {
                return;
            }
            this.loading = true;
            this.error = false;
            request('../api2/send_email_verification/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.email,
                })
            }).then(data => {
                if (data.ok) {
                    return data.json()
                }
            }).then(data => {
                this.error = null;
                if (data.exists) {
                    this.storage.set('email', this.email).then(() => {
                        this.$router.push({ name: 'verification-code' })
                    })
                } else {
                    this.error = data.error;
                }
            }).catch(() => {
                this.error = 'Wystąpił błąd. Spróbuj ponownie później.'
            }).finally(() => {
                this.loading = false
            })
        }
    }

}
</script>

<style scoped>
main {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100%;
    padding: 0 20px;
    /* background: var(--bg-gradient); */
}

.button {
    background: var(--login-button-bg);
    color: var(--login-button-color);


    font-size: 15px;
    /* line-height: 30px; */
    text-transform: uppercase;

    border: none;

    margin-top: 25px !important;
    font-weight: 600;

}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    margin: 0 auto;
}


input {
    padding: 0 22px;
    background-color: var(--login-button-bg);
    border: 1px solid var(--login-button-bg);
    font-size: 12px;
    color: var(--login-button-color);
    font-weight: 600;



    /* background: var(--radial-gradient); */
    /* -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; 
  background-clip: text; */

    box-sizing: border-box;
    box-shadow: 4px 4px 6px 0px rgba(0, 0, 0, 0.25);

}

/* input selected */
input:focus {
    outline: none;
    /* border: 1px solid var(--theme-light); */
}

input::selection {
    background: var(--text-selection)
}

input::placeholder {
    color: var(--text-gray);
}

#logo {
    width: 60%;
    margin-top: 30px;
    margin-bottom: 30px;
}

form {
    margin-top: 30px;
    width: 80%;
}

.errors {
    color: red;
    font-size: 12px;
    text-align: center;
}

.pill {
    width: 100%;
    height: 60px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 30px;
}




.small-link {
    font-size: 10px;
    color: var(--text-gray);
    font-weight: 600;
    text-decoration: none;
    padding: 10px;
}

.f-right {
    float: right;
}

.f-left {
    float: left;
}


.info {
    font-size: 14px;
    color: var(--theme-text);
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
}

h1 {
    font-size: 28px;
    color: var(--theme-light);
    font-weight: 600;
    margin-bottom: 20px !important;
    text-align: center;
}
</style>