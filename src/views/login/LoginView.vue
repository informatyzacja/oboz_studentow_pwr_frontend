<script setup>
import { IonPage, IonContent } from '@ionic/vue';
import logo from '@/assets/ikona.png';

import { loginGetToken } from '@/functions/login.js'
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <main>
                <img id="logo" :src="logo" alt="logo">


                <input type="hidden" name="remember" value="true">

                <span v-if="error" class="errors">
                    Twój adres e-mail lub hasło są nieprawidłowe.
                </span>

                <div>
                    <input id="email" name="username" type="email" autocomplete="username" required class="pill"
                        placeholder="E-MAIL" v-model="email">

                    <input id="password" name="password" type="password" autocomplete="current-password" required
                        class="pill" placeholder="HASŁO" v-model="password">


                    <button @click="submit" class="pill button">
                        Zaloguj
                    </button>
                    <a href="{% url 'register' %}" class="small-link f-left">Zarejestruj się</a>
                    <a href="{% url 'password_reset' %}" class="small-link f-right">Zapomniałem hasła</a>

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
            password: '',
            error: false,
            loading: false
        }
    },
    methods: {
        submit() {
            this.loading = true;
            this.error = false;
            loginGetToken(this.email, this.password)
                .then(success => {
                    if (success) {
                        this.$router.push('/')
                    } else {
                        this.error = true
                    }
                })
                .finally(() => {
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
    background: var(--bg-gradient);
}

.button {
    background: var(--theme-light);
    color: var(--theme-dark);


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
    background-color: var(--theme-dark);
    border: 1px solid var(--theme-dark);
    font-size: 12px;
    color: var(--theme-light);
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
    width: 80%;
    margin-top: 30px;
    margin-bottom: 30px;
}

form {
    margin-top: 30px;
    width: 80%;
}

.errors {
    color: red;
    font-size: 10px;
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
</style>