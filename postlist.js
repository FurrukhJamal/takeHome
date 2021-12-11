import React from 'react';
import { TextInput, Button, StatusBar, Platform, StyleSheet, Text, View, FlatList, Image,  SafeAreaView, TouchableOpacity} from 'react-native';
import * as WebBrowser from "expo-web-browser";
import Autocomplete from 'react-native-autocomplete-input';

const PostList = (props)=>(
  <View style = {styles.postListContainer}>
    <FlatList
      contentContainerStyle = {{ paddingTop : 20, alignItems : "center"}}
      data = {props.data}
      renderItem = {(obj)=>renderPost(obj, props.openLink)}
      keyExtractor = {(item, index)=> index.toString()}
      onEndReached = {props.onEndReached}
      removeClippedSubviews = {true}
      />
  </View>
)


const renderPost = (obj,openInBrowser)=>{
  //console.log("Object in renderPost", obj)
  //convert the time stamp to a date
  let timeStamp = new Date(obj.item.data.created * 1000)
  //console.log("TimeStamp Creation :", obj.item.data.created_utc)
  let date = timeStamp.toDateString()
  //console.log("DATE :", timeStamp)
  return (
    <TouchableOpacity
      style = {styles.postContainer}
      onPress = {()=>openInBrowser(obj.item.data.permalink)}>
      <View style = {styles.rowContainer}>
        <View style = {styles.thumbnailContainer}>
          {
            obj.item.data.thumbnail ? (
              <Image
                source = {{uri : obj.item.data.thumbnail}}
                style = {{width : "90%", height : "90%"}}
                resizeMode = "contain"/>
            ) : (
              <View style = {{width:"100%", height : "100%", alignItems : "center"}}>
              <Image
                source = {require("./assets/noimage.png")}
                style = {{width : "90%", height : "90%"}}
                resizeMode = "contain"/>

              <Text style = {{color : "red"}}>No image available</Text>
              </View>
            )

          }

        </View>
        <View style = {styles.infoContainer}>
          <View style = {{alignSelf : "flex-end", backgroundColor : "yellow"}}>
            <Text style = {{padding : 10}}>{date}</Text>
          </View>
          <View style = {styles.titleContainer}>
            <Text style = {{fontSize : 22, fontWeight : "bold"}}>{obj.item.data.title}</Text>
          </View>
          <View style = {styles.authorScoreRow}>
            <View style = {styles.authorContainer}>
              <Text style = {{flex : 1}} numberOfLines = {1}>{obj.item.data.author}</Text>
            </View>
            <View style ={styles.scoreContainer}>
              <Text>{obj.item.data.score}</Text>
            </View>
            <View style = {styles.commentsContainer}>
              <Text>{obj.item.data.num_comments} coments</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
)}

const styles = StyleSheet.create({
  postListContainer : {
    width : "100%",
    //alignItems : "center",
  },
  postContainer : {
    width : "90%",
    //backgroundColor : "blue",
    marginBottom : 10,
    // borderBottomWidth : 2,
    // borderBottomColor : "white",
    borderTopWidth : 2,
    borderTopColor : "white",
  },
  rowContainer : {
    flexDirection : "row",
    width : "100%",
    padding : 15,
    alignItems : "center"
  },
  thumbnailContainer: {
    width: 100,
    height : 100,
    //backgroundColor : "white",
    alignItems : "center",
    marginRight : 10,
  },
  infoContainer : {
    //backgroundColor : "green",
    width : "80%",
    padding : 10,
  },
  titleContainer : {
    width : "100%",
    //backgroundColor : "pink",
    padding : 10,

  },
  authorScoreRow : {
    width : "100%",
    flexDirection : "row",
    //backgroundColor : "red",
    justifyContent : "space-between",
    padding : 10,
  },
  authorContainer : {
    width : "50%",
    //backgroundColor : "teal",
    alignItems : "center",
    borderWidth: 1,
    borderColor : "white",
    justifyContent : "center",
  },
  scoreContainer : {
    borderWidth: 1,
    borderColor : "white",
    justifyContent : "center",
    width : "18%",
    alignItems : "center",
  },
  commentsContainer : {
    width : "30%",
    //backgroundColor : "white",
    alignItems : "center",
    borderWidth: 1,
    borderColor : "white"
  },

})

export default PostList;
