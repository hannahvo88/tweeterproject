<template>
  <v-card class="mx-auto" max-width="384" min-width="384"  tile>
    <v-img height="200px" v-if="user.bannerUrl!==''" :src="user.bannerUrl"></v-img>
    <v-img height="200px" v-else src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"></v-img>
    <v-col>
      <v-avatar size="100" style="position:absolute; top: 130px">
        <v-img v-if="user.bannerUrl!==''" :src="user.bannerUrl"></v-img>
        <v-img v-else src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
      </v-avatar>
    </v-col>
    <v-list-item color="rgba(0, 0, 0, .4)">
      <v-list-item-content>
        <router-link style="color: #3F51B5; cursor: pointer; font-size:20px;" :to="{name:'userProfile',params:{id:user.userId}}">{{user.username}}</router-link>
        <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
        <v-list-item-subtitle>{{user.bio}}</v-list-item-subtitle>
        <v-list-item-subtitle>{{user.birthdate}}</v-list-item-subtitle>
      </v-list-item-content>
      <v-spacer/>
      <v-list-item-content>
        <div>
          <v-btn
              v-if="isMyFollow()"
              @click="unfollowUser"
              color="error"
              elevation="2"
              max-width="100"
          >Unfollow</v-btn>
          <v-btn
              v-else
              @click="followUser"
              color="success"
              elevation="2"
              max-width="75"
          >Follow</v-btn>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import api from "../services/api"
import cookies from "vue-cookies"

export default {
  name: "SingleUser",
  props:{
    user:{
      type:Object
    }
  },
  data(){
    return {
      follow:true,
    }
  },
  mounted() {

  },
  computed:{
    myFollows:{
      get(){
        return this.$store.state.myFollows
      },
    }
  },
  methods:{
    isMyFollow(){
      const response = this.myFollows.filter((item)=>{
        return item.userId === this.user.userId;
      })
      if(response.length>0){
        return true;
      }
      return false;

    },
    unfollowUser(){
      api().delete('follows',{
        data:{
          "loginToken": cookies.get('loginToken'),
          "followId": this.user.userId
        }
      })
        // eslint-disable-next-line no-unused-vars
      .then(response=>{
        this.$store.dispatch('getFollowers',{})
      })
     .catch((error)=>{
        console.log(error);
      })
    },
    followUser(){
      api().post('follows',{
        "loginToken": cookies.get('loginToken'),
        "followId": this.user.userId
      })
      .then(response=>{
        if(response.data.message=== 'Success'){
          this.$store.dispatch('getFollowers',{})
        }
      }).catch((error)=>{
        console.log(error);
      })
    }
  }
}
</script>

<style scoped>
/*.container::-webkit-scrollbar {
  display: none;
}*/
</style>