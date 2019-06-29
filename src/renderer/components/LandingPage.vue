<template>
  <div id="wrapper">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="swagger地址 :" prop="path" required>
        <el-input v-model="form.path" placeholder="请输入SwaggerUI的docs地址"></el-input>
      </el-form-item>
      <el-form-item label="BasePath :" prop="basePath" required>
        <el-input v-model="form.basePath" placeholder="请输入basePath"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">生成data.js</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  import Swagger from './build/swagger.js'
  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data(){
      return {
        form:{
          path:'http://192.168.124.254:8091/v2/api-docs?group=Default',
          basePath:''
        }
      }
    },
    mounted(){
     
    },
    methods:{
      onSubmit(){
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false
          } 
           Swagger.load(this.form.path,this.form.basePath)
        })
        
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
