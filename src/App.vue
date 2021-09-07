<template>
  <div id="app">
    <v-app>
      <v-app-bar v-if="login" app>
        <v-toolbar-title>
          <router-link to="/" tag="span" style="cursor: pointer">
            <h1 class="mt-5 mb-5" style="color:#3F51B5">Tweeter</h1>

          </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-spacer></v-spacer>

        <profileDropdown v-if="login" />

      </v-app-bar>

      <v-main>

        <v-container fluid>

          <router-view></router-view>
        </v-container>
      </v-main>

      <v-footer v-if="login" app>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import cookies from 'vue-cookies';
import profileDropdown from "./components/ProfileDropdown";
export default {
  components:{
    profileDropdown
    },
  name: 'App',
  mounted() {
    if (cookies.get('loginToken') !== null) {
      this.$store.commit('makeLogin', true);
    } else {
      this.$router.push({name: 'login'})
    }
  },
  computed: {
    login: {
      get() {
        return cookies.isKey('loginToken') && cookies.get('loginToken')!==null;
      }
    }
  }
};
</script>

<style>
  body {
    max-width: 80vw;
    margin: auto;
    background-color: #3F51B5;

  }
.v-toolbar__content, .v-toolbar__extension {
    max-width: 80vw;
    margin: auto;

}
  @media only screen and (max-width: 600px) {
      #app {
    max-width: 93vw;
      }
  }

</style>
