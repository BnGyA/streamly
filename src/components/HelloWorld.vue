<template>
  <div class="hello">
    <h2>Twitchers: {{lives}}</h2>
    <input type="text" name="username" id="username" v-model="username" >
    <button @click="getId">getId</button>
    <button @click="getVideo">getId</button>
  </div>
</template>

<script>
import db from '@/firebase/init'
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data() {
    return{
      username: '',
      id:'',
      lives: [],
      videos: [],
      config: {
          headers: {'Client-ID': 'bj4n17r5g7ztuog08idhnllq04yivm'}
      }
    }
  },
  props: {
    msg: String
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
    }

  },
  created(){
    db.collection('twitcher').get() 
    .then(snapshot => {
      snapshot.forEach(doc =>{
        let single_twitcher = doc.data()
        single_twitcher.id = doc.id
        
        axios.get(`https://api.twitch.tv/helix/streams?user_id=${single_twitcher.user_id}`, this.config)
        .then((res) =>{
          console.log(res);
          if(res.data.data[0]){
            single_twitcher.status = res.data.data[0].type;
          } else{
            single_twitcher.status = "Not Live";
          }
          this.lives.push(single_twitcher)
        }).catch((err) =>{
          console.log(err);
        })


        
      })
    })
  }
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
