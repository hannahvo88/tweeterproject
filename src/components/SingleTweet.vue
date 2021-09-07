<template>
  <div>
    <v-card class="mx-auto mt-4 pa-4 " style="position: relative" shaped>
      <v-card-title>
        <v-row>
          <v-col cols="12" >
            <router-link style="color: #3F51B5; cursor: pointer; font-size:20px;" :to="{name:'userProfile',params:{id:tweet.userId}}">{{ tweet.username }}</router-link>
          </v-col>

          <v-row v-if="authUser" style="position: absolute;right: 0">
            <v-col>
              <v-btn
                  class="mx-2"
                  x-small
                  fab
                  dark
                  color="cyan"
                  @click="editTweetDialog=true"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>

              <v-btn
                  class="mx-2"
                  x-small
                  fab
                  dark
                  color="red"
                  @click="deleteTweetDialog=true"
              >
                <v-icon dark>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>

        </v-row>
      </v-card-title>

      <v-card-text>{{ tweet.content }}</v-card-text>

      <v-card-actions>
        <v-row>

          <v-col cols="4" sm="4">
            <v-btn
                icon
                :color="tweetLiked?'deep-orange':'grey'"
                @click="toggleLike"
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <span class="px-2">{{ likes.length }}</span>
          </v-col>


          <v-col cols="4" sm="4">
            <v-btn
                icon
                :color="commentShow?'green':'grey'"
                @click="commentShow=!commentShow"
            >
              <v-icon>mdi-comment</v-icon>
              <span class="px-2">{{ comments.length }}</span>

            </v-btn>
          </v-col>

        </v-row>
      </v-card-actions>


      <v-card v-show="commentShow" class="mx-auto mt-4 pa-4 " style="position: relative" >
        <v-card-title>Comments</v-card-title>

        <v-form ref="commentForm">
          <v-row>

            <v-col cols="8">
              <v-text-field
                  label="Your comment"
                  hide-details="auto"
                  :rules="[value => !!value || 'Required.',]"
                  v-model="commentText"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn
                  depressed
                  x-small
                  color="primary"
                  @click="makeComment"
              >
                Comment
              </v-btn>
            </v-col>

          </v-row>
        </v-form>

        <v-row  v-for="comment in comments" :key="comment.commentId">
         <v-col sm="12">
           <SingleComment @deleteComment="deleteComment"  :comment="comment" />
         </v-col>
        </v-row>
      </v-card>
    </v-card>



    <v-dialog
        v-model="deleteTweetDialog"
        persistent
        max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are sure want to delete tweet?
        </v-card-title>
        <v-card-text>after delete this tweet you can't restore it.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="deleteTweetDialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="deleteTweet"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="editTweetDialog"
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
              @click="editTweetDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Update tweet</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-row class="px-4 mx-3 mt-4">
          <v-textarea
              v-model="tweet.content"
              :rules="[value => !!value || 'Required.',]"
              auto-grow
              name="input-7-4"
              label="what's on your mind"
          ></v-textarea>
        </v-row>

        <v-card-actions>
          <v-btn
              color="green darken-1"
              text
              @click="editTweetDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="updateTweet"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "@/services/api";
import cookies from "vue-cookies";
import SingleComment from "@/components/SingleComment";

export default {
  name: "SingleTweet",
  components:{SingleComment},
  data() {
    return {
      likes: [],
      comments: [],
      commentText: "",
      tweetLiked: false,
      commentShow:false,
      deleteTweetDialog: false,
      editTweetDialog: false,
      requestData: {
        "loginToken": cookies.get('loginToken'),
        "tweetId": this.tweet.tweetId
      }
    }
  },
  computed: {
    authUser: {
      get() {
        return this.tweet.userId === parseInt(cookies.get('userId'));
      }
    }
  },
  props: {
    tweet: {
      type: Object
    },

  },
  mounted() {
    this.getLikes(this.tweet.tweetId);
    this.getAllComments();
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    deleteComment(comment) {
      this.getAllComments();
    },
    iLiked() {
      const get = this.likes.filter((item) => {
        return item.userId === parseInt(cookies.get('userId'));
      });

      this.tweetLiked = get.length > 0;
    },

    getLikes(id) {
      api().get('tweet-likes?tweetId=' + id)
          .then(response => {
            this.likes = response.data;
            this.iLiked();
          })
    },

    toggleLike() {
      if (this.tweetLiked) {
        this.removeLike();
      } else {
        this.addLike();
      }
    },

    removeLike() {
      this.tweetLiked = false;
      api().delete('tweet-likes', {
        data: this.requestData
      })
          .then(response => {
            if (response.status === 204) {
              this.getLikes(this.tweet.tweetId);
            }
          }).catch((error) => {
          console.log(error);
      })
    },

    addLike() {
      this.tweetLiked = true;
      api().post('tweet-likes', this.requestData)
          .then(response => {
            if (response.status === 201) {
              this.getLikes(this.tweet.tweetId);
            }
          }).catch((error) => {
          console.log(error);
      })

    },

    deleteTweet() {
      api().delete('tweets', {
        data: this.requestData
      })
      .then(response => {
        if (response.status === 204) {
          this.deleteTweetDialog = false;
          this.$destroy();
          this.$el.parentNode.removeChild(this.$el);
        }
      }).catch((error) => {
      console.log(error);
      })
    },

    getAllComments() {
      api().get('comments?tweetId=' + this.tweet.tweetId)
      .then(response => {
        const sort = response.data.sort((a, b) => b.commentId - a.commentId);
        this.comments = sort;
      }).catch((error) => {
      console.log(error);
      })
    },

    updateTweet() {
      api().patch('tweets', {
        "loginToken": cookies.get('loginToken'),
        "tweetId": this.tweet.tweetId,
        "content": this.tweet.content
      })
          // eslint-disable-next-line no-unused-vars
      .then(response => {
        this.editTweetDialog = false;
      }).catch((error) => {
      console.log(error);
    })
    },


    makeComment(){
      if(this.$refs.commentForm.validate()){
        api().post('comments',{
          "loginToken": cookies.get('loginToken'),
          "tweetId": this.tweet.tweetId,
          "content": this.commentText
        })
        .then(response=>{
          if(response.status=== 200){
            this.$refs.commentForm.reset();

            this.comments = [response.data].concat(this.comments);
          }
        }).catch((error) => {
          console.log(error);
      })
      }
    }
  }
}
</script>

<style scoped>

</style>