<template>
<!-- mapレイヤのような形で生成される -->
  <div id='map'>
    <!-- spot種別検索メニュー -->
    <type-button @update-type="updateType"/>
    <!-- 大学名検索ボタン -->
    <univ-button :univFlag="univFlag" v-on:click.native="updateUniv()" v-if='this.$store.state.userData != null'/>
    <!-- 通常モードとスポット登録モードの切り替えボタン -->
    <spot-reg-button :regFlag="regFlag" v-on:click.native="changeMode()" v-if='this.$store.state.userData != null'/>
    <!-- 現在地ボタン -->
    <now-loc-button v-on:click.native="setNowLocation()"/>
    <spot-detail :showDialog="showDialog" :spot_id="selectedSpotID" @close="closeDialog()"/>
  </div>  
</template>

<script lang='js' src='./Map.js' />

<style scoped>
/* むやみにいじると地図表示が消えるので注意*/
html,
body,
#map { 
  height: 100%; 
  width: 100%;
  z-index: 0;
  }
body {
  margin: 0;
  height: 100%;
}

.marker {
    text-align      : center
;   color           : white
;   font-size       : 16
;   border-radius   : 8px
;   box-shadow      : 8px 8px 8px rgba( 0, 0, 0, 0.4 )
}
.red {
    background      : red
}
  /* 各オブジェクトのstyleでz-indexを0以上に設定する 
  基本は1000でOK*/
</style>