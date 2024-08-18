<script setup>
import { IonPage, IonContent, IonSpinner, IonNavLink } from '@ionic/vue';
import logo from '@/assets/ikona.png';

import { request } from '@/stores/functions';
import { Preferences } from '@capacitor/preferences'
import { Storage } from '@ionic/storage';
import { Keyboard } from '@capacitor/keyboard';
</script>

<template>
    <ion-page>
        <ion-content :fullscreen="false">
            <IonNavLink router-link="/login" router-direction="back">
                <div class="back-link">
                    <div class="arrow"></div>
                    Wróć
                </div>
            </IonNavLink>
            <main>
                <img id="logo" :src="logo" alt="logo">

                <div>

                    <p class="info">
                        Podaj kod weryfikacyjny wysłany na {{ email }}. <br>
                    </p>

                    <input id="verification-code" name="verification-code" type="number" autocomplete="one-time-code"
                        inputmode="numeric" required class="pill" placeholder="Kod weryfikacyjny" pattern="\d*"
                        v-model="verificationCode" maxlength="8" enterkeyhint="go" @keyup.enter="submit"
                        oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);">

                    <p v-if="error" class="errors">
                        Podany kod weryfikacyjny jest nieprawidłowy.
                    </p>

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
            error: false,
            loading: false,
            verificationCode: ''
        }
    },
    watch: {
        verificationCode(newVal, oldVal) {
            if (newVal.toString().length === 8) {
                this.submit()
            }
        }
    },
    async mounted() {
        this.storage = new Storage();
        await this.storage.create();
        if (await this.storage.get('email')) {
            this.email = await this.storage.get('email');
        } else {
            this.$router.push('/login')
        }
    },
    methods: {
        submit() {
            if (!this.verificationCode) {
                return;
            }

            Keyboard.hide();
            this.loading = true;
            this.error = false;
            request('../api2/login_with_code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: this.verificationCode,
                    email: this.email
                })
            }).then(data => {
                if (data.ok) {
                    return data.json()
                }
            }).then((data) => {
                if (data.access && data.refresh) {
                    this.storage.remove('email')
                    Preferences.set({ key: 'access_token', value: data.access })
                        .then(() => {
                            Preferences.set({ key: 'refresh_token', value: data.refresh })
                                .then(() => {
                                    this.$router.push('/home')
                                })
                        })
                } else {
                    this.error = true;
                }
            }).catch(() => {
                this.error = true;
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

.back-link {
    position: fixed;
    left: 10px;
    top: calc(10px + var(--ion-safe-area-top));
    display: flex;
    align-items: center;
}

.arrow {
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 7px;
    margin-left: 4px;
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
}
</style>