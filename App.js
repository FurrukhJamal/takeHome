// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StatusBar, Platform, StyleSheet, Text, View, FlatList, Image,  SafeAreaView, TouchableOpacity} from 'react-native';
import * as WebBrowser from "expo-web-browser";


const PostList = (props)=>(
  <View style = {styles.postListContainer}>
    <FlatList
      contentContainerStyle = {{paddingTop : 20, alignItems : "center"}}
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
            <View style = {styles.commentsContainer}>
              <Text>{obj.item.data.num_comments} coments</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
)}



export default class App extends React.Component{
  state = {
    "Posts" : [],
    allPosts : true,
    topPosts : false,
    newPosts : false,
    api_url : "https://api.reddit.com/r/programming/hot.json",

  }

  async componentDidMount(){
    let response = await fetch(`${this.state.api_url}`)
    let result = await response.json()
    // console.log("New DATA:", result.data.children[0].data.title)
    this.setState({
      Posts : result.data.children,
      queryAfter : result.data.after,
    }, ()=>{
      console.log("QueryFlag: ", this.state.queryAfter)
    })
  }

  //to open each post in device's browser
  handlePostClick = async(url)=> {
    console.log("Link to open:", url)
    let link = "https://www.reddit.com" + url
    await WebBrowser.openBrowserAsync(link);
  }


  //logic to display all posts
  handleAllPostSelection = ()=>{
    this.setState({
      allPosts : true,
      topPosts : false,
      newPosts : false,
    })
  }

  //to handle Top Posts Selection
  handleTopPostSelection = ()=>{
    this.setState({
      allPosts : false,
      topPosts : true,
      newPosts : false,
    })


  }

  //to handle newest Post Selection
  hanldeNewPostSelection = async()=> {
    let link = "https://api.reddit.com/r/programming/new.json"
    this.setState({
      allPosts : false,
      topPosts : false,
      newPosts : true,
      queryAfter : "",
      api_url : link,
  }, async()=>{
    let result = await getPosts()
    this.setState({
      "Posts" : [...result.data],
      "queryAfter" : result.queryAfter})
  })


}

//get appropriate POsts
getPosts = async()=> {
  let response = await fetch(`${this.state.api_url}`)
  let result = await response.json()
  // console.log("New DATA:", result.data.children[0].data.title)
  return(
  {
    "data" : result.data.children,
    "queryAfter" : result.data.after
  })
}

loadMorePosts = async()=>{
  //fetching the next batch of posts by adding a query parameter acording to the reddit docs
  let response = await fetch(`${this.state.api_url}?after=${this.state.queryAfter}`)
  let result = await response.json()
  let data = [...result.data.children]
  let query = result.data.after
  let test = [...this.state.Posts]
  console.log("Post:",typeof(this.state.Posts))
  //update the posts and query parameter
  this.setState((previousState)=>({
    Posts : [...test, ...data],
    queryAfter : query,
  }))

}

  render()
  {
    //console.log("LENGTH OF POSTS ARRAY:", this.state.Posts.length)

    return(
      <SafeAreaView style = {styles.container}>
        {/*Panel to select top or new posts*/}
        <View style = {styles.postSelectionContainer}>
          <View>
            <Button
              title = "All Posts"
              disabled = {this.state.allPosts ? true : false}
              onPress = {this.handleAllPostSelection}/>
          </View>
          <View>
            <Button
              title = "Top Posts"
              disabled = {this.state.topPosts ? true : false}
              onPress = {this.handleTopPostSelection}/>
          </View>
          <View>
            <Button
              title = "Newest Posts"
              disabled = {this.state.newPosts ? true : false}
              onPress = {this.hanldeNewPostSelection}/>
          </View>
        </View>

        <PostList
          data = {this.state.Posts}
          openLink = {this.handlePostClick}
          onEndReached = {this.loadMorePosts}/>
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

  },
  commentsContainer : {
    width : "30%",
    backgroundColor : "white",
    alignItems : "center",
  },
  postSelectionContainer : {
    flexDirection : "row",
    justifyContent : "space-around",
    marginBottom : 10,
    width : "100%",
    marginTop : 10,
  }
});
