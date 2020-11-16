<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/about">
        About
      </router-link>
    </div> -->
    <Loading />
    <router-view />
  </div>
</template>

<script>
/* components */
import Loading from './components/Loading/Loading';

export default {
   components:{
      Loading,

   }
};
</script>

<style>
#app {
  font-family : Avenir, Helvetica, Arial, sans-serif;
  color : #2c3e50;
  /* text-align : center; */
  -webkit-font-smoothing : antialiased;
  -moz-osx-font-smoothing : grayscale;
}

#nav {
  padding : 30px;
}

#nav a {
  font-weight : bold;
  color : #2c3e50;
}

#nav a.router-link-exact-active {
  color : #42b983;
}
*{
    padding : 0;
    margin : 0;
}
</style>
