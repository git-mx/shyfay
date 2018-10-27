<template>
  <div>
    <h1>vuex 测试</h1>
    <button @click="clickme">点我试试</button>
  </div>
</template>

<script>

  export default {
    methods: {
      clickme: function(){
        //存在vuex里面的值在刷新页面的时候会回到初始值，初始值就是在state里声明那个变量的时候给的值
        console.log(this.$store.state.userName);
        console.log(this.$store.getters.getUserName);
        //this.$store.dispatch('setUserName', 'test');
      }
    }
  }

</script>