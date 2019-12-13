<template>
  <div class="home">
    <h2>Who's watching ?</h2>
    <ul>
      <li v-for="watcher in watchers" v-bind:key="watcher.user_id">
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
  created(){
    db.collection('twitcher').get() 
    .then(snapshot => {
      snapshot.forEach(doc =>{
        this.watchers.push(doc.data())
      })
    })
  }
}
</script>
