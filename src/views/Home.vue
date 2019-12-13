<template>
  <div class="home">
    <h2>Who's watching ?</h2>
    <ul>
      <li v-for="watcher in watchers" v-bind:key="watcher.id">
        <button @click="deleteUser(watcher.id)">Delete</button>
        <router-link :to="{name: 'Streamers', params: {user_id: watcher.user_id}}">{{watcher.login}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src

import db from '@/firebase/init'
export default {
  name: 'home',
  data(){
    return{
      watchers: [],
    }
  },
  methods: {
    deleteUser(id){
        db.collection('twitcher').doc(id).delete()
        .then(() => {
            this.watchers = this.watchers.filter(watcher =>{
            return watcher.id != id
            })
        })  
    }
  },
  created(){
    db.collection('twitcher').get() 
    .then(snapshot => {
      snapshot.forEach(doc =>{
        let watcher = doc.data();
        watcher.id = doc.id;
        this.watchers.push(watcher)
      })
    })
  }
}
</script>
