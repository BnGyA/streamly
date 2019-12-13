<template>
  <div class="hello">
    <h1>{{$route.params.user_id}}</h1>
    <div v-if="!loading">
        <h2>{{lives.length}} Streams Online</h2>
      <ul>
        <li v-for="acti in activ" v-bind:key="acti.user_id" class="stream">            
            <div class="stream__tuile" v-bind:class="{isActive: acti.status == 'live'}" :style="{ background : 'url(' + acti.profil_image_url + ')'}"></div>    
            <p>{{acti.username}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
//import db from '@/firebase/init'
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'Streamers',
  data() {
    return{
      username: '',
      id: this.$route.params.user_id,
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
  computed: {
    activ: function(){
      return _.orderBy(this.followed
      .filter(item => !this.deactivated.includes(item.username)), 'status')
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
                let user_profile_image_url = res.data.data[0].profile_image_url;
                let offline_image_url = res.data.data[0].offline_image_url;
                // Retreive their live infos
                 axios.get(`https://api.twitch.tv/helix/streams?user_id=${user_id}`, this.config)
                .then((res)=>{
                  
                  // est en live
                  if(res.data.data[0]){
                    this.followed.push({
                      'username': to_name, 
                      'status': 'live', 
                      'user_id': the_user_id,
                      'profil_image_url' : user_profile_image_url,
                      'offline_image_url' : offline_image_url
                       })
                    this.lives.push(res.data.data[0]);
                    this.loading = false;
                  }else{
                    this.followed.push({
                      'username': to_name, 
                      'status': 'not live', 
                      'user_id': the_user_id,
                      'profil_image_url' : user_profile_image_url,
                      'offline_image_url' : offline_image_url
                      })
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
  created(){
      this.getFollows();
  }
}
</script>

<style>
.stream__tuile{
    display: inline-block;
    width: 300px;
    height: 300px; 
    content: '';
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
}

.stream__tuile.isActive{
    border:2px solid red;
}

ul{
    list-style: none;
}

.stream{
    display: inline-block;
}
</style>