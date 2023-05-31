<template>
    <div class="navigation-bar">
        <router-link to="/sos">
            <div class="navigation_bar__item">
                <img src="/icons8-sos.png" alt="sos" />
                <p>SOS</p>
            </div>
        </router-link>
        <router-link to="/mapa">
            <div class="navigation_bar__item">
                <img src="/icons8-map_marker.png" alt="map" />
                <p>Mapka<br>Harmonogram</p>
            </div>
        </router-link>
        <router-link to="/">
        <div class="navigation-bar__logo">
            <img src="/The-Hunger-Games-PNG-File.png" alt="logo" />
        </div>
        </router-link>
        <router-link to="/warsztaty">
            <div class="navigation_bar__item">
                <img src="/icons8-hammer.png" alt="hammer" />
                <p>Warsztaty</p>
            </div>
        </router-link>
        <router-link to="/profil">
            <div class="navigation_bar__item">
                <img src="/icons8-male_user.png" alt="user" />
                <p>Profil</p>
            </div>
        </router-link>
    </div>
</template>

<style scoped>
.navigation-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 15px 25px;
    height: 75px;
    background-color: var(--bg-lighter);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);

    position: fixed;
    bottom: 0;
    width: 100%;
}

.navigation-bar__logo {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    background-color: var(--bg-lighter);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px -3px 8px rgba(0, 0, 0, 0.25);
}

.navigation-bar__logo img {
    width: 60px;
    height: 60px;
}

.navigation_bar__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 9px;
    text-align: center;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 50px;

}

.navigation_bar__item img {
    width: 30px;
    object-fit: contain;
}

.navigation_bar__item p {
    margin: 0;
    padding-bottom: 3px;
    line-height: 9px;
}

</style>