<template>
  <v-app id="inspire">
    <v-main>
      <v-img class="mr-3" src="../assets/logo.jpg" height="100px" width="100px"> 
      </v-img>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Register form</v-toolbar-title>
              </v-toolbar>
              <v-form
                  ref="form"
                  v-model="valid"
              >

                <v-card-text >
                  <v-alert
                      dense
                      outlined
                      type="error"
                      v-if="error"
                  >
                    <strong>Can't</strong> login, Username Or Password are incorrect !
                  </v-alert>
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
                      :rules="[rules.required]"
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      type="password"
                      v-model="password"
                  >

                  </v-text-field><v-text-field
                      id="password"
                      :rules="[
        (value) => !!value || 'type confirm password',
        (value) =>
          value === this.password || 'The password confirmation does not match.',
      ]"
                      prepend-icon="lock"
                      name="rpt_password"
                      label="Repeat Password"
                      type="password"
                      v-model="password_confirm"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="login" color="primary" >Register</v-btn>
                  <v-spacer></v-spacer>
                  <a @click="sendToSignInPage">Login</a>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import api from "../services/api";
import cookies from 'vue-cookies';

export default {
  name: "LoginComp",

  data() {
    return {
      error:false,
      email: "",
      username: "",
      birthdate:'',
      bio:'',
      password: "",
      password_confirm: "",
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
      },
    }
  },
  methods: {
    login: function () {
      if(this.$refs.form.validate()){
        api().post('users',
        {
          email: this.email,
          password: this.password,
          bio:this.bio,
          username:this.username,
          birthdate: this.birthdate,
        })
        .then((response) => {
          cookies.set('loginToken', response.data.loginToken);
          cookies.set('userId', response.data.userId);
          console.log(response.data.loginToken);
          // console.log(process.env.VUE_APP_KEY);
          this.$store.commit('makeLogin',true)
          this.$router.push('/');
          window.location.reload();

        }).catch((error) => {
      console.log(error);
      this.error=true


        })
      }



    },
    sendToSignInPage() {
      return this.$router.push({name:'login'})
    }
  },
}
</script>

<style scoped>

</style>