<template>
  <div class="hello">
    
    <div v-if="!loading">
      <h2>Twitchers you follow: </h2>
      <ul>
        <li v-for="acti in activ" v-bind:key="acti.user_id">{{acti.username}} {{acti.status}}</li>
      </ul>
      <h2>Twitchers you follow that are live</h2>
      <ul>
        <li v-for="live in lives" v-bind:key="live.id">{{live}}</li>
      </ul>
    </div>
    <input type="text" name="username" id="username" v-model="username" >
    <button @click="getId">getId</button>
    <button @click="getVideo">getVideos</button>
    <button @click="getFollows">getFollows</button>
  </div>
</template>

<script>
//import db from '@/firebase/init'
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data() {
    return{
      username: '',
      id:'',
      lives: [],
      videos: [],
      followed: [],
      deactivated: [],
      loading: true,
      config: {
          headers: {'Client-ID': 'bj4n17r5g7ztuog08idhnllq04yivm'}
      }
    }
  },
  props: {
    msg: String
  },
  computed: {
    activ: function(){
      return this.followed
      .filter(item => !this.deactivated.includes(item.username))
    }
  },
  methods:{
    getId(){

      //→ curl -H 'Client-ID: bj4n17r5g7ztuog08idhnllq04yivm' -X GET 'https://api.twitch.tv/helix/streams?user_id=41719107'
      axios.get(`https://api.twitch.tv/helix/users?login=${this.username}`, this.config)
        .then((res) =>{
          this.id = res.data.data[0].id;
          console.log('Id: ' + this.id);
        }).catch((err) =>{
          console.log(err);
        })
    },
    getVideo(){
      axios.get(`https://api.twitch.tv/helix/videos?user_id=${this.id}`, this.config)
        .then((res) =>{
          console.log(res);
          
        }).catch((err) =>{
          console.log(err);
        })
    },

    getFollows(){
      // Retreive following list
      axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${this.id}&first=99`, this.config)
        .then((res) =>{
          
          let singles_twitcher = res.data.data;
          
          singles_twitcher.forEach(doc=>{  
            
            let to_name = doc.to_name;
            let the_user_id = doc.to_id;

            // Get the following list account info to check if they are deactivated
            axios.get(`https://api.twitch.tv/helix/users?login=${doc.to_name}`, this.config)
            .then((res) =>{
              
              // If deactivated or banned
              if(res.data.data.length > 0){
                let user_id = res.data.data[0].id;
                // Retreive their live infos
                 axios.get(`https://api.twitch.tv/helix/streams?user_id=${user_id}`, this.config)
                .then((res)=>{
                  
                  // est en live
                  if(res.data.data[0]){
                    this.followed.push({
                      'username': to_name, 
                      'status': 'live', 
                      'user_id': the_user_id})
                    this.lives.push(res.data.data[0]);
                    this.loading = false;
                  }else{
                    this.followed.push({
                      'username': to_name, 
                      'status': 'not live', 
                      'user_id': the_user_id})
                    this.loading = false;
                  }
                })
                .catch((err) =>{
                  console.log(err);
                })

              }else{
                this.deactivated.push(doc.to_name)
              }
            })
            .catch((err) =>{
              console.log(err);
            })            
          })
          
        }).catch((err) =>{
          console.log(err);
        })
    }

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
