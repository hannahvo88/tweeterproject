<template>
  <div>
    <!-- Profile Section -->
    <v-skeleton-loader
        class="mx-auto"
        type="card"
        v-if="!loaded"
    ></v-skeleton-loader>
    <v-card v-else class="mx-auto" tile>
      <v-img height="250px" v-if="user.bannerUrl===null"
             src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"></v-img>
      <v-img height="250px" v-else :src="user.bannerUrl"></v-img>



      <v-col style="position: relative">
        <v-avatar size="100" style="position:absolute; top: -130px">
          <v-img v-if="user.imageUrl===null" src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
          <v-img v-else :src="user.imageUrl"></v-img>
        </v-avatar>


      </v-col>


      <v-list-item color="rgba(0, 0, 0, .4)">
        <v-list-item-content>

          <v-list-item-title class="title">
            {{ user.username }}
            <v-btn
                v-if="authUser"
                class="mx-2"
                fab
                dark
                x-small
                color="primary"
                @click="editProfileDialog=true"
            >
              <v-icon dark>
                mdi-pencil
              </v-icon>
            </v-btn>

            <v-btn
                v-if="authUser"
                class="mx-2"
                fab
                dark
                x-small
                color="red"
                @click="deleteProfileDialog=true"
            >
              <v-icon dark>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-list-item-title>
          <v-list-item-subtitle>{{ user.bio }}</v-list-item-subtitle>
          <v-list-item-subtitle>{{ user.birthdate }}</v-list-item-subtitle>
          <v-spacer></v-spacer>
          <div v-if="!authUser">
            
            <div>
              <v-btn
                  v-if="isMyFollow()"
                  @click="unfollowUser"
                  color="error"
                  elevation="2"
              >Unfollow
              </v-btn>
              <v-btn
                  v-else
                  color="success"
                  elevation="2"
                  @click="followUser"
              >Follow
              </v-btn>
            </div>
          </div>

        </v-list-item-content>
      </v-list-item>
    </v-card>



    <v-dialog
        v-model="editProfileDialog"
        persistent
        fullscreen
        max-width="600"
    >
      <v-card tile>

        <v-toolbar
            flat
            dark
            color="primary"
        >
          <v-btn
              icon
              dark
              @click="editProfileDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Update Profile</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-form
            ref="form"

        >

          <v-card-text>
            <v-text-field

              :rules="[rules.required]"
                v-model="email"
                prepend-icon="mail"
                name="email"
                label="Email"
                type="email"
            ></v-text-field>
            <v-text-field
              :rules="[rules.required]"
                v-model="username"
                prepend-icon="person"
                name="email"
                label="Username"
                type="email"
            ></v-text-field>
            <v-text-field
                prepend-icon="calender"
                name="birthdate"
                v-model="birthdate"
                :rules="[rules.required]"
                label="Birthday"
                type="date"
            ></v-text-field>
            <v-textarea
                v-model="bio"
                :rules="[rules.required]"
                solo
                name="bio"
                prepend-icon="receipt"
                label="Bio"
            ></v-textarea>
            <v-text-field
                id="password"
                prepend-icon="lock"
                name="password"
                label="New Password"
                type="password"
                v-model="password"
            >

            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="updateProfile" color="warning">Update</v-btn>
          </v-card-actions>
        </v-form>

      </v-card>
    </v-dialog>

    <v-dialog
        v-model="deleteProfileDialog"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are sure want to delete Profile?
        </v-card-title>

        <v-card-text>after delete this Profile you can't restore it.Please input your password</v-card-text>
        <v-form ref="deleteform" class="px-4 mx-4">
          <v-text-field
              id="password"
              :rules="[rules.required]"
              prepend-icon="lock"
              name="password"
              label="Confirm Password"
              type="password"
              v-model="password"
          ></v-text-field>
        </v-form>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="deleteProfileDialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="deleteProfile"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SingleTweet v-for="tweet in tweets" :key="tweet.tweetId" :auth-user="authUser" :tweet="tweet"/>


  </div>
</template>

<script>
import api from "../services/api"
import cookies from "vue-cookies"
import SingleTweet from "../components/SingleTweet"

export default {
  name: "UserProfile",
  components: {SingleTweet},
  data() {
    return {
      loaded: false,
      user: {},
      authUser: false,
      editProfileDialog: false,
      deleteProfileDialog: false,
      change: '',
      image: "",
      imageSizeError: false,
      tweets: [],
      email: "",
      username: "",
      birthdate: '',
      bio: '',
      password: "",
      password_confirm: "",

      rules: {
        required: value => !!value || 'Required.',
      },
    }
  },
  mounted() {
    this.getUser(this.$route.params.id)
  },
  watch: {
    '$route.params.id': function (id) {
      this.getUser(id)
    }
  },
  computed: {
    myFollows: {
      get() {
        return this.$store.state.myFollows
      },
    }
  },
  methods: {
    getUser(id) {
      api().get('users?userId=' + id)
          .then((response) => {
            if (response.status === 200) {
              this.loaded = true;
              this.user = response.data[0];
              this.email = this.user.email;
              this.username = this.user.username;
              this.birthdate = this.user.birthdate;
              this.bio = this.user.bio;

              this.getUserTweets();
              if (parseInt(cookies.get('userId')) === this.user.userId) {
                this.authUser = true
              }
            }
          }).catch(error => {
             console.log(error)
      });
    },
    getUserTweets() {
      api().get('tweets?userId=' + this.$route.params.id)
      .then(response => {
        this.tweets = response.data;
      }).catch(error => {
             console.log(error)
      });
    },
    isMyFollow() {
      const response = this.myFollows.filter((item) => {
        return item.userId === this.$route.params.id;
      })
      return response.length > 0;


    },
    unfollowUser() {

      api().delete('follows', {
        data: {
          "loginToken": cookies.get('loginToken'),
          "followId": this.user.userId
        }
      })
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            this.$store.dispatch('getFollowers', {})
          })
         .catch(error => {
             console.log(error)
      });
    },
    followUser() {

      api().post('follows', {
        "loginToken": cookies.get('loginToken'),
        "followId": this.user.userId
      })
          .then(response => {
            if (response.data.message === 'Success') {
              this.$store.dispatch('getFollowers', {})
            }
          })
          .catch(error => {
             console.log(error)
      });
    },

    updateProfile() {
      if (this.$refs.form.validate()) {
        const rData = {
          loginToken: cookies.get('loginToken'),

          email: this.email,
          username: this.username,
          birthdate: this.birthdate,
          bio: this.bio
        }

        if (this.password !== "") {
          rData['password'] = this.password
        }
        api().patch('users', rData)
            .then(response => {
              if (response.status === 200 ||response.status === 201) {
                this.editProfileDialog = false;
                window.location.reload();
              }
            }).catch(error => {
             console.log(error)
      });
      }

    },

    deleteProfile() {
      if(this.$refs.deleteform.validate()){
        api().delete('users', {
          data: {
            loginToken: cookies.get('loginToken'),
            password: this.password
          }
        })
        .then(response=>{
          if(response.status===204){
            this.deleteProfileDialog = false
            this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
            this.$router.push({path: '/login'})
            window.location.reload()
          }
        }).catch(error => {
             console.log(error)
      });
      }
    },

  }
}
</script>

<style scoped>

</style>