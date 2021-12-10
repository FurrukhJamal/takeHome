// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StatusBar, Platform, StyleSheet, Text, View, FlatList, Image,  SafeAreaView, TouchableOpacity} from 'react-native';

const PostList = (props)=>(
  <View style = {styles.postListContainer}>
    <FlatList
      contentContainerStyle = {{paddingTop : 20, alignItems : "center"}}
      data = {props.data}
      renderItem = {renderPost}
      keyExtractor = {(item, index)=> index.toString()}/>
  </View>
)


const renderPost = (obj)=>{
  //console.log("Object in renderPost", obj)
  //convert the time stamp to a date
  let timeStamp = new Date(obj.item.data.created)
  console.log("TimeStamp Creation :", obj.item.data.created_utc)
  let date = timeStamp.toDateString()
  console.log("DATE :", timeStamp)
  return (
    <TouchableOpacity style = {styles.postContainer}>
      <View style = {styles.rowContainer}>
        <View style = {styles.thumbnailContainer}>
          <Image
            source = {require("./assets/noimage.png")}
            style = {{width : "90%", height : "90%"}}
            resizeMode = "contain"/>
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
            <View>
              <Text>{obj.item.data.score}</Text>
            </View>
            <View><Text>coments</Text></View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
)}



export default class App extends React.Component{
  state = {
    "Posts" : []
  }

  async componentDidMount(){
    let response = await fetch("https://api.reddit.com/r/programming/hot.json")
    let result = await response.json()
    // console.log("New DATA:", result.data.children[0].data.title)
    this.setState({
      Posts : result.data.children,
    }, ()=>{
      //console.log("Posts are after in state:", this.state.Posts)
    })
  }

  render()
  {
    return(
      <SafeAreaView style = {styles.container}>
        <PostList data = {this.state.Posts}/>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop : Platform.OS == "android" ? StatusBar.currentHeight: 0,
    alignItems : "center",
    backgroundColor : "grey"
  },
  postListContainer : {
    width : "100%",
    //alignItems : "center",
  },
  postContainer : {
    width : "90%",
    backgroundColor : "blue",
    marginBottom : 10,
    //alignItems : "center",
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
    backgroundColor : "white",
    alignItems : "center",
    marginRight : 10,

  },
  infoContainer : {
    backgroundColor : "green",
    width : "75%",
    padding : 10,
  },
  titleContainer : {
    width : "100%",
    backgroundColor : "pink",
    padding : 10,

  },
  authorScoreRow : {
    width : "100%",
    flexDirection : "row",
    backgroundColor : "red",
    justifyContent : "space-around",
    padding : 10,
  },
  authorContainer : {
    width : "50%",
    backgroundColor : "teal",
    alignItems : "center",

  }
});
