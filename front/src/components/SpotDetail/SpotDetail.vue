<template>
    <v-dialog
      v-model="showDialog"
      width="1200"
      persistent
    >
        <v-card>
            <!-- ローディング画面 -->
            <v-skeleton-loader
                v-if="isLoading"
                type="image, article, article"
                class="mx-auto"
            ></v-skeleton-loader>
            <v-container v-if="!isLoading">
                <!-- 写真 -->
                <v-carousel
                    cycle
                    hide-delimiter-background
                    show-arrows-on-hover
                >
                    <v-carousel-item
                        :src="photo"
                    />
                </v-carousel>
                <v-row
                    justify="center"
                    class="mx-10
                    mt-3 mb-5"
                >
                    <!-- スポット名 -->
                    <h1 class="mr-10"> {{ spotData.spot_name }} </h1>

                    <!-- スポットタイプ --> 
                    <!-- <spot-type-icon v-for="type in spotData.types" :key="type"
                        :type="type"
                        class="mr-5"
                        large
                        color="gray"        複数タイプに対応していないので一旦コメントアウト
                    /> -->
                    <spot-type-icon
                        :type="spotData.spot_type"
                        class="mr-5"
                        large
                        color="gray"
                    />


                </v-row>

            <v-row>
                <!-- スポットの評価(レーダーチャート) -->
                <v-col>
                    <v-row justify="center">
                        <radarChartDisp
                            :type="this.spotData.spot_type"
                            :reviewRating="rating5"
                        />
                    </v-row>
                </v-col>

                <!-- レビュー 一覧 -->
                <v-col>
                    <v-row justify="center">
                        <!-- 星評価平均 -->
                        平均
                        <star-rating
                            v-model="rating"
                            read-only
                            :increment=0.1
                        >
                        </star-rating>
                    </v-row>
                    <v-row justify="center">
                        <!-- レビューリスト -->
                        <v-col cols="11">
                            <spot-review-list :reviews="sliced_reviews" />
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <!-- レビューリストのページ遷移をするやつ -->
                        <v-col cols="8">
                            <v-container class="max-width">
                                <v-pagination                                
                                    @input="change_page"
                                    v-model="now_review_page"
                                    :length="num_page"
                                    :total-visible="7"
                                ></v-pagination>
                            </v-container>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <!-- レビュー投稿ボタン -->
                        <v-col cols="5">
                            <spot-review-register  
                                v-if="this.$store.state.userData != null"
                                :spot_id="spotData.spot_id"
                                :spot_type="spotData.spot_type" 
                                @submit="updateDetail()"
                            />
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn block @click="closeDialog()">
                        <h3>Close</h3>
                    </v-btn>
                </v-col>
            </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import starRating from 'vue-star-rating'
import spotReviewList from './SpotReviewList.vue'
import spotTypeIcon from '../share/SpotTypeIcon.vue'
import spotReviewRegister from './SpotReviewRegister.vue'
import radarChartDisp from '../share/RadarChartDisp'
import {getSpot} from '../../routes/spotRequest'
import {average} from '../../routes/reviewRequest'

export default {
    components: {
        starRating,
        spotReviewList,
        spotTypeIcon,
        spotReviewRegister,
        radarChartDisp
    },
    data: function() {
        return {
            spotData: {spot_name:"", spot_type:""},
            reviews: [],
            rating: 5,
            rating5: [0,0,0,0,0],
            photo: require("@/assets/Hakataramen.jpg"),    //仮
            num_page: 0,
            REVIEW_NUM_PER_PAGE: 3, //1ページあたりの表示するレビュー数
            now_review_page: 1,

            pos: {
                lat: 0,
                lon: 0
            },
            isLoading: false
        }
    },
    props: {
        spot_id: String,
        showDialog: Boolean
    },
    methods: {
        // change_page: function(dir) {
        //     const next_page = this.now_review_page + dir
        //     const max_page = (this.reviews.length ) / this.review_num_per_page
        //     if(next_page < 1 || next_page > max_page) return
        //     else this.now_review_page = next_page
        // },
        change_page: function(number){
            console.log(number)
            return this.now_review_page = number
        },
        sum: function(arr){ // 配列の要素の合計を計算
            var sum = 0;
            arr.forEach(element => {
                sum += element;
            });
            return sum
        },
        ave: function(arr){ // 配列の要素の平均を計算
            return (this.sum(arr))/arr.length
        },
        closeDialog: function() {
            this.$emit("close");
        },
        updateDetail: function() {
            this.isLoading = true;      // データを取得している間はローディング画面を表示する
            getSpot(this.spot_id, "", "", "", "")
                .then(res => {
                    this.spotData = res.spots[0];
                    this.reviews = res.review;
                    this.isLoading = false;
                    this.rating = this.calcRating(this.reviews.map(r =>  Number(r.score)));
                    this.rating5 = this.calcFor5Score(this.reviews.map(r =>  Number(r.score1)),
                                                this.reviews.map(r =>  Number(r.score2)),
                                                this.reviews.map(r =>  Number(r.score3)),
                                                this.reviews.map(r =>  Number(r.score4)),
                                                this.reviews.map(r =>  Number(r.score5)));
                    this.num_page = Math.ceil(this.reviews.length/this.REVIEW_NUM_PER_PAGE) // 総ページ数
                })
        },
        calcRating: function(scores) {
            return average(scores);
        },
        calcFor5Score: function(score1, score2, score3, score4, score5){
            return [average(score1),average(score2),average(score3),average(score4),average(score5)];
        }
    },

    computed: {
        //現在のページに表示するレビューを返す
        sliced_reviews: function() {
            const start = (this.now_review_page-1) * this.REVIEW_NUM_PER_PAGE;
            const end = start + this.REVIEW_NUM_PER_PAGE;
            const raw_reviews = this.reviews.slice(start, end)
            // レビューごとにidを振っておかないとv-forでワーニング出るので対応
            var enumerated_reviews = []
            for(var i = 0; i < raw_reviews.length; i++) {
                enumerated_reviews.push({id:i, content:raw_reviews[i]});
            }
            return enumerated_reviews;
        },
    },

    watch: {
        showDialog: function() {    //ダイアログが開いた(閉じた)時に実行するメソッド
            if(!this.showDialog) return;
            console.log(this.spot_id)
            this.updateDetail()
            this.now_review_page = 1;
        }
    }
}
</script>