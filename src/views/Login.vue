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
                <v-toolbar-title>Login form</v-toolbar-title>
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
                      prepend-icon="person"
                      name="email"
                      label="Login"
                      type="text"
                  ></v-text-field>
                  <v-text-field
                      id="password"
                      :rules="[rules.required]"
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      type="password"
                      v-model="password"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="login" color="primary" to="/">Login</v-btn>
                  <v-spacer></v-spacer>
                  <a @click="sendToSignUpPage">Register New</a>
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
import api from "../services/api"
import cookies from 'vue-cookies'

export default {
  name: "LoginComp",


  data() {
    return {
      error:false,
      email: "",
      password: "",
      valid: false,
      rules: {
          required: value => !!value || 'Required.',
        },

    }
  },
  methods: {
    login: function () {
      if(this.$refs.form.validate()){
        api().post('login', {
          email: this.email,
          password: this.password
        })
        .then((response) => {
          cookies.set('loginToken', response.data.loginToken);
          cookies.set('userId', response.data.userId);
          console.log(response.data)
          this.$store.commit('makeLogin',{data:response.data})
          this.$router.push({path:'/'});
          window.location.reload();
        }).catch((error) => {
            console.log(error);
            this.error=true


        })
      }



    },
    sendToSignUpPage() {
      return this.$router.push({name:'register'})
    }
  },
}
</script>

<style>
.v-main__wrap {
  height: fit-content;
}

</style>