<template>
    <v-icon
        class="mr-5"
        large
        :color="iconColor"
    >
        {{ type_dict[type] }}
    </v-icon>    
</template>

<script>
import {getSpotTypeDict} from "./SpotTypeFunction"
export default {
    props: {
        type: String,
        iconColor: String // spot iconのカラー指定
    },
    data: function() {
        return {
            type_dict: getSpotTypeDict('icon')
        }
    }  
}
</script>