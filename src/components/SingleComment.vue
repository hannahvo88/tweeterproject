<template>
  <v-card  class="mx-auto mt-4 pa-4 " style="position: relative" >
    <v-card-title>
      <v-row>
        <v-col cols="12" sm="6">
          <router-link :to="{name:'userProfile',params:{id:comment.userId}}">{{ comment.username }}</router-link>
        </v-col>

        <v-row v-if="authUser" style="position: absolute;right: 0">
                        <v-col>
                          <v-btn
                              class="mx-2"
                              fab
                              dark
                              x-small
                              color="cyan"
                              @click="editComment=true"
                          >
                            <v-icon dark>
                              mdi-pencil
                            </v-icon>
                          </v-btn>

                          <v-btn
                              class="mx-2"
                              fab
                              x-small
                              dark
                              color="red"
                              @click="deleteCommentDialog=true"
                          >
                            <v-icon dark>
                              mdi-delete
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>

      </v-row>
    </v-card-title>

    <v-form ref="commentEdit" v-if="editComment">
      <v-container>
        <v-row>
          <v-col
              cols="12"
              md="4"
          >
            <v-text-field
                v-model="newComment"
                :rules="[value => !!value || 'Required.',]"

                label="Comment"
                required
            ></v-text-field>
          </v-col>

          <v-col
              cols="12"
              md="4"
          >
            <v-btn small  color="primary" @click="updateComment" >Update</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-card-text v-else >{{ comment.content }}</v-card-text>


    <v-dialog
        v-model="deleteCommentDialog"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are sure want to delete comment?
        </v-card-title>
        <v-card-text>after delete this comment you can't restore it.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="deleteCommentDialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="deleteComment"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>


</template>

<script>
import cookies from "vue-cookies"
import api from "../services/api"

export default {
  name: "SingleComment",
  data(){
    return {
      editComment:false,
      deleteCommentDialog:false,
      newComment:''
    }
  },
  props:{
    comment:{
      type:Object
    }
  },
  computed: {
    authUser: {
      get() {
        return this.comment.userId === parseInt(cookies.get('userId'));
      }
    }
  },
  mounted() {
    this.newComment = this.comment.content;
  },
  methods:{
    updateComment(){
      if(this.$refs.commentEdit.validate()){
        api().patch('comments',{
          "loginToken": cookies.get('loginToken'),
          "commentId": this.comment.commentId,
          "content": this.newComment
        })
        .then(response=>{
          if(response.status===200){
            this.editComment = false;
            this.$emit('deleteComment',this.comment)
            this.newComment = this.comment.content;
          }
        }).catch((error) => {
          console.log(error);
      })
      }
    },

    deleteComment(){
      api().delete('comments',{
        data:{
          "loginToken": cookies.get('loginToken'),
          "commentId": this.comment.commentId
        }
      })
      .then(response=>{
        if(response.status===204){
          this.deleteCommentDialog= false;
          this.$emit('deleteComment',this.comment)
          this.$destroy();
          this.$el.parentNode.removeChild(this.$el);
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