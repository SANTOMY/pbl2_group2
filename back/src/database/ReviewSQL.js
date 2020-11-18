'use strict';
const con = require('./DBHandler.js');
const {info, debug, warning, error}  = require('../winston');
const { connect } = require('../route/reviewRoute.js');
const pool = con.pool;
const fileLabel = "ReviewSQL"
const Review = require('../objects/review');
const util = require('util');

module.exports.saveReview = async function(newReview){
    const checkQuery = {
        text: 'SELECT spot_id from spots.spots Where spot_id = $1',
        values: [newReview.spotId]
    };
    const query = {
        text: 'INSERT INTO spots.review(review_id, spot_id, comment, score, user_id) VALUES($1, $2, $3, $4, $5);',
        values: [newReview.reviewId, newReview.spotId, newReview.comment, newReview.score, newReview.userId]
    };
    const client = await pool.connect();
    return client.query(checkQuery)
    .then( nullchecker =>{
        if(nullchecker.rowCount == 0){
            client.release();
            error(fileLabel,"There is no spot at: " + newReview.spotId);
            return {"success":false,"data":newReview.spotId};
        }
        return client.query(query)
        .then(() =>{
            client.release();
            debug(fileLabel,"saved review: " + newReview);
            return {"success":true,"data":newReview};
        })
        .catch((err)=>{
            client.release();
            info(fileLabel,"ERROR OBJECT:" + util.inspect(err,{showHidden: false, depth: null}));
            error(fileLabel,"Error while saving review: " + err);
            return {"success":false,"data":err};
        });
    })
    .catch()
}

module.exports.getReviewBySpotId = async function(spotId){
    const query = {
        text: `SELECT * FROM spots.review WHERE spot_id='${spotId}'`
    };
    const client = await pool.connect();
    return client.query(query).then( result => {
        client.release();
        if (result.rowCount == 0)
            return {"success":false, "data":"Review does not exist"};
        info(fileLabel,"get review by spot_id: " + util.inspect(spotId,{showHidden: false, depth: null}));
        return {"success":true, "data":result.rows};
    }).catch((err)=>{
        client.release();
        info(fileLabel,"ERROR OBJECT:" + util.inspect(err,{showHidden: false, depth: null}));
        error(fileLabel,"Error while getting review. " + err);
        return {"success":false, "data":err};      
    });
}