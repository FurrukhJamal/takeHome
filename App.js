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
            <Text style = {{padding : 10}}>some date</Text>
          </View>
          <View style = {styles.titleContainer}>
            <Text style = {{fontSize : 32}}>Some Big Title</Text>
          </View>
          <View style = {styles.authorScoreRow}>
            <View><Text>author</Text></View>
            <View><Text>sxore</Text></View>
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
  },
  thumbnailContainer: {
    width: 100,
    height : 100,

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
  }
});
