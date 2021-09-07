<template>
  <div class="text-center" v-if="userId!==null">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
          v-bind="attrs"
          v-on="on"
          color="indigo">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <router-link :to="{name:'userProfile',params:{id:userId}}">Profile</router-link>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <a @click="logout">Logout</a>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import cookies from 'vue-cookies'
import api from "../services/api"

export default {
  name: "profileDropdown",

  data: () => ({
    userId:cookies.get('userId')
  }),
  methods:{
    logout(){
      api().delete('login',{
        data:{
          "loginToken": cookies.get('loginToken')
        }
      })
      .then(response=>{
        if(response.status===204){
          this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
          this.$router.push({path:'/login'})
          window.location.reload()
        }
      }).catch((error) => {
          console.log(error);
      })

    }
  }
}
</script>

<style scoped>

</style>