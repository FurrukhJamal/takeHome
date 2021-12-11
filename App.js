// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Pressable,TextInput, Button, StatusBar, Platform, StyleSheet, Text, View, FlatList, Image,  SafeAreaView, TouchableOpacity} from 'react-native';
import * as WebBrowser from "expo-web-browser";
import Autocomplete from 'react-native-autocomplete-input';
import PostList from "./postlist";

 // <TouchableOpacity style = {{backgroundColor : "red"}} onPress = {()=>{
 //     console.log("searched item clicked")
 //       this.setState({searchedValue : item})
 //   }}>
 //   <Text>{item}</Text>
 //   <Text>test</Text>
 // </TouchableOpacity>





export default class App extends React.Component{
  state = {
    "Posts" : [],
    allPosts : true,
    topPosts : false,
    newPosts : false,
    api_url : "https://api.reddit.com/r/programming/hot.json",
    searchedValue : "",
    searchedData : [],
    flagToDisplayAutoComplete : true
  }

  async componentDidMount(){
    let response = await fetch(`${this.state.api_url}`)
    let result = await response.json()
    // console.log("New DATA:", result.data.children[0].data.title)
    this.setState({
      Posts : result.data.children,
      queryAfter : result.data.after,
    }, ()=>{
      //console.log("QueryFlag: ", this.state.queryAfter)
    })
  }

  //to open each post in device's browser
  handlePostClick = async(url)=> {
    //console.log("Link to open:", url)
    let link = "https://www.reddit.com" + url
    await WebBrowser.openBrowserAsync(link);
  }


  //logic to display all posts
  handleAllPostSelection = ()=>{
    let link = "https://api.reddit.com/r/programming/hot.json"
    this.setState({
      allPosts : true,
      topPosts : false,
      newPosts : false,
      queryAfter : "",
      api_url : link,
    },
    async()=>{
      let result = await this.getPosts()
      this.setState({
        "Posts" : [...result.data],
        "queryAfter" : result.queryAfter})
    })
  }

  //to handle Top Posts Selection
  handleTopPostSelection = ()=>{
    let link = "https://api.reddit.com/r/programming/top.json"
    this.setState({
      allPosts : false,
      topPosts : true,
      newPosts : false,
      queryAfter : "",
      api_url : link,
    },
    async()=>{
      let result = await this.getPosts()
      this.setState({
        "Posts" : [...result.data],
        "queryAfter" : result.queryAfter})
    }
    )


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
    let result = await this.getPosts()
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
  //console.log("Post:",typeof(this.state.Posts))
  //update the posts and query parameter
  this.setState((previousState)=>({
    Posts : [...test, ...data],
    queryAfter : query,
  }))

}

handleInputChange = (text)=>{
  //console.log("Text Typed", text)
  this.setState({searchedValue : text})
}


handleSearchSubmit = (event)=> {
  event.persist()
  //console.log("Key pressed", event.nativeEvent.text.length)
  //add the searched item in the history
  if(event.nativeEvent.text.length != 0)
  {
    //bug fix to stop adding empty space if submit was pressed with anything typed
    this.setState((previousState)=> {
      //console.log("previousState:", previousState.searchedData)
      return({
        searchedData : [...previousState.searchedData, event.nativeEvent.text],
        searchedValue : "",
      })
    })
  }

}


displayAutoCompList = ()=>{
  this.setState({
    flagToDisplayAutoComplete : false
  })
}

test = (item)=>{
  console.log("Inside Test Funxtion, itm,", item)
  return (
  <TouchableOpacity style = {{borderWidth : 2, borderColor : "white", padding : 20,backgroundColor : "red"}}
    onPress = {()=>console.log("Pressed")}>
    <View><Text>{item}</Text></View>
  </TouchableOpacity>
)}

  render()
  {
    //console.log("LENGTH OF POSTS ARRAY:", this.state.Posts.length)
    //const data = filterData(this.state.searchedValue)
    return(
      <SafeAreaView style = {styles.container}>
        {/*Autocoomplete textinput*/}
        <View style = {styles.inputContainer}>
          <Autocomplete
            containerStyle = {{width : "90%", paddingBottom : 20}}
            data={this.state.searchedData}
            value={this.state.searchedValue}
            onChangeText={this.handleInputChange}
            onSubmitEditing = {this.handleSearchSubmit}
            onFocus = {this.displayAutoCompList}
            onBlur = {()=>this.setState({flagToDisplayAutoComplete : true})}
            hideResults = {this.state.flagToDisplayAutoComplete}
            placeholder = "Search"
            flatListProps={{
              keyExtractor: (_, idx) => idx.toString(),
              renderItem: ({ item }) =>this.test(item),
            }}/>

        </View>


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
    backgroundColor : "gray"
  },

  postSelectionContainer : {
    flexDirection : "row",
    justifyContent : "space-around",
    marginBottom : 10,
    width : "100%",
    marginTop : 69,
  },
  inputContainer : {
    marginBottom : 20,
    width : "80%",
    //backgroundColor : "yellow",
    //alignItems : "center",
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: StatusBar.currentHeight,
    zIndex: 1,
    left : 40,

  }
});
