<template>
    <div>
        <form @submit.prevent="AddUser">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" v-model="username">
            <button>Add user</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import db from '@/firebase/init';
export default{
    name: 'AddUser',
    data(){
        return{
            username: null,
            feedback: null,
            user_id: null,
            config: {
                headers: {'Client-ID': 'bj4n17r5g7ztuog08idhnllq04yivm'}
            }
        }
    },
    methods: {
        AddUser(){
            console.log(this.username)
            if(this.username){
                axios.get(`https://api.twitch.tv/helix/users?login=${this.username}`, this.config)
                    .then((res) =>{
                        this.user_id = res.data.data[0].id;
                        db.collection('twitcher').add({
                            login: this.username,
                            user_id: this.user_id
                        }).then(() =>{
                            this.$router.push({name : 'home'})
                        }).catch((err)=>{
                            console.log('database problem' + err)
                        })
                    }).catch((err) =>{
                        console.log(err);
                    })
            }else{
                this.feedback = 'You must enter a valid username'
            }

        },
        
    }
}
</script>