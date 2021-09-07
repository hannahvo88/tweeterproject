<template>
  <v-container fluid fill-height>
    <h1 class="pb-5">Discovery</h1>
    <v-skeleton-loader
        class="mx-auto"
        type="card"
        width="100%"
        v-if="!loaded"
    ></v-skeleton-loader>
    <div v-else style="overflow-x:auto; white-space: nowrap;display: flex;gap: 12px;">
      <div v-for="user in users" :key="user.id">
        <SingleUser :user="user"  v-if="user.userId!==authUser" />
      </div>

    </div>

    <div style="width: 100%">
      <Tweet @done="newTweet"/>
    </div>

    <v-row>
      <v-col cols="12" v-for="tweet in tweets" :key="tweet.tweetId">
        <SingleTweet  :tweet="tweet"  />
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

import api from "../services/api"
import SingleUser from "../components/SingleUser"
import Tweet from "../components/Tweet"
import SingleTweet from "../components/SingleTweet"
import cookies from "vue-cookies"

export default {
  components:{
    SingleUser,
    Tweet,
    SingleTweet
    },

  name: 'Home',

  data() {
    return {
      loaded:false,
      tweets:[],
      authUser: cookies.get('userId')
    }
  },
  computed: {

    users:{
      get(){
        return this.$store.state.users
      },
    },
    myFollows:{
      get(){
        return this.$store.state.myFollows
      },
      set(value){
        this.$store.commit('setmyFollows',value)
      }
    }
  },
  mounted() {
    this.getTweets();
    this.getUsers();
    this.getFollowers();
  },
  methods: {
    newTweet(tweet) {
      this.tweets = [tweet].concat(this.tweets);
    },
    getTweets() {
      api().get('tweets').then(response => {
        this.tweets = response.data.sort((a, b) => b.tweetId - a.tweetId);

      })
    },
    getUsers() {
      this.$store.dispatch('getUsers',{})
    },
    getFollowers() {
      // eslint-disable-next-line no-unused-vars
      this.$store.dispatch('getFollowers',{}).then((response)=>{
        this.loaded = true;
      })
    }

  }
}
</script>
<style scoped>
  h1 {
    padding-bottom: 20px;
  }
</style>