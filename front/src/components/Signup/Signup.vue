<template>
<v-app>
    <v-card width="400px" class="mx-auto mt-5">
        <v-card-title>
            <h1 class="display-1">新規登録</h1>
        </v-card-title>
        <v-card-text>
            <v-form ref="loginForm">
                <v-text-field label="ユーザ名"
                    prepend-icon="mdi-account-circle"
                    v-model="username" 
                    :counter="32"
                    :rules="usernameRules"/>

                <v-text-field label="メールアドレス"
                    prepend-icon="mdi-email"
                    v-model="email" 
                    :counter="128"
                    :rules="emailRules"/>

                <v-text-field label="パスワード"
                    prepend-icon="mdi-lock" 
                    v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
                    v-bind:type="showPassword ? 'text' : 'password'" 
                    @click:append="showPassword = !showPassword"
                    v-model="password"
                    :counter="32"
                    :rules="passwordRules" />
                    
                <v-text-field label="所属大学"
                    prepend-icon="mdi-school"
                    v-model="university" 
                    :counter="64"
                    :rules="universityRules"/>

                <v-card-actions>
                    <v-btn @click="createUser">登録</v-btn>
                </v-card-actions>
            </v-form>
        </v-card-text>
    </v-card>
</v-app>
</template>

<script>
import {register} from '../../routes/userRequest'
const User = require("../../store/user");
export default {

    data: function() {
        return {
            username : '',
            email : '',
            password : '',
            university: '',

            showPassword : false,
            usernameRules: [
                v => !!v || "ユーザ名は必須項目です。",
                v => (v && v.length <= 32) || "ユーザ名は32文字以内で入力してください。",
            ],
            emailRules: [
                v => !!v || "メールアドレスは必須項目です。",
                v => (v && v.length <= 128) || "メールアドレスは128文字以内で入力してください。",
                v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
            ],
            passwordRules: [
                v => !!v || "パスワードは必須項目です。",
                v => (v && v.length <= 32) || "パスワードは32文字以内で入力してください。"
            ],
            universityRules: [
                v => !!v || "所属大学名は必須項目です。",
                v => (v && v.length <= 64) || "所属大学名は64文字以内で入力してください。",
            ],
        }
    },

    methods: {
        createUser: function() {
            if (!this.$refs.loginForm.validate()) return;
            register(this.username,this.email,this.password,this.university)
                .then(res => {
                    console.log(res)
                    //const userData = {"id":res.userId, "email":res.email, "username":res.userName}
                    const userData = new User(res.userId, res.userName, res.email, null, res.university)
                    console.log(userData)
                    this.$store.commit("login", userData)
                    this.$router.push('/map')
                });
        }
    }
    
}
</script>