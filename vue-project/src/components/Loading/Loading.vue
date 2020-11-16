<template>
  <div
    v-if="show"
    class="loading-container"
  >
    <img
      src="@/assets/loading.gif"
      alt="loading"
      class="loading-image"
    >
  </div>
</template>

<script>
import { mapState } from 'vuex';

import './loading.scss';
export default {
   computed:{
      ...mapState({
         show: state=>state.loading.show
      })
   }
};
</script>
